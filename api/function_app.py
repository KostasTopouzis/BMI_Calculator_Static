import azure.functions as func
import json, psycopg, os, logging, re
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()



#######################
# Environment variables
#######################

hostAzure = os.environ['POSTGRES_HOST']
databaseAzure = os.environ['POSTGRES_DATABASE']
userAzure = os.environ['POSTGRES_USER']
passwordAzure = os.environ['POSTGRES_PASSWORD']


#####################
# Auxiliary functions
#####################

def checkCredentials(username: str, password: str):
    if len(username) < 8 or len(password) < 8 or re.search(r'[^\w-]', username):
       return False

    return True

# def connectDB():
#     connection = psycopg.connect(
#         host=hostAzure,
#         dbname=databaseAzure,
#         user=userAzure,
#         password=passwordAzure,
#         port=5432
#     )
#     return connection

def connectDB():
    connection = psycopg.connect(
        host='localhost',
        dbname='bmi_calc_test',
        user='postgres',
        password='marine26#',
        port=5432
    )
    return connection

def authenticateUser(connection, username, raw_password):
    with connection:
        with connection.cursor() as cursor:
            query = 'SELECT hashed_password FROM users WHERE username = %s'
            cursor.execute(query, (username,))

            row = cursor.fetchone()

            if not row:
                return False

            stored_hash = row[0]

            try:
                ph.verify(stored_hash, raw_password)

                if ph.check_needs_rehash(stored_hash):
                    new_hash = ph.hash(raw_password)
                    query = 'UPDATE users SET hashed_password = %s WHERE username = %s'
                    cursor.execute(query, (new_hash, username))

                return True

            except VerifyMismatchError:
                return False


##############################
# Instantiating Azure Function
##############################

app = func.FunctionApp()

@app.route(route='login', methods=['POST'])
def login(req: func.HttpRequest) -> func.HttpResponse:
    try:
        try:
            req_body = req.get_json()
        except ValueError:
            return func.HttpResponse(
                json.dumps({
                    'error': 'invalid_json',
                    'message': 'Request body must contain valid JSON.'
                }),
                mimetype='application/json',
                status_code=400
            )

        if not isinstance(req_body, dict):
            return func.HttpResponse(
                json.dumps({
                    'error': 'invalid_request',
                    'message': 'Request body must be a JSON object.'
                }),
                mimetype='application/json',
                status_code=400
            )

        username = req_body.get('username')
        password = req_body.get('password')

        if not isinstance(username, str) or not isinstance(password, str):
            return func.HttpResponse(
                json.dumps({
                    'error': 'missing_credentials',
                    'message': 'Username and password are required.'
                }),
                mimetype='application/json',
                status_code=400
            )

        username = username.strip()
        if not (username and password):
            return func.HttpResponse(
                json.dumps({
                    'error': 'missing_credentials',
                    'message': 'Username and password are required.'
                }),
                mimetype='application/json',
                status_code=400
            )

        if not checkCredentials(username, password):
            return func.HttpResponse(
                json.dumps({
                    'error': 'invalid_credentials_format',
                    'message': 'Username or password does not meet the required format.'
                }),
                mimetype='application/json',
                status_code=400
            )

        # Establish connection
        connection = connectDB()

        isValid = authenticateUser(connection, username, password)

        if not isValid:
            return func.HttpResponse(
                json.dumps({
                    'error': 'authentication_failed',
                    'message': 'Invalid username or password.'
                }),
                mimetype='application/json',
                status_code=401
            )

        connection.close()

        return func.HttpResponse(
            json.dumps({
                'message': 'Login successful.',
                'username': username
            }),
            mimetype='application/json',
            status_code=200
        )
    
    except Exception as e:
        logging.exception('Login request failed: %s', e)
        return func.HttpResponse(
            json.dumps({
                'error': 'internal_server_error',
                'message': 'An unexpected server error occurred.'
            }),
            mimetype='application/json',
            status_code=500
        )


@app.route(route='signup', methods=['POST'])
def signup(req: func.HttpRequest) -> func.HttpResponse:
    try:
        try:
            req_body = req.get_json()
        except ValueError:
            return func.HttpResponse(
                json.dumps({
                    'error': 'invalid_json',
                    'message': 'Request body must contain valid JSON.'
                }),
                mimetype='application/json',
                status_code=400
            )

        if not isinstance(req_body, dict):
            return func.HttpResponse(
                json.dumps({
                    'error': 'invalid_request',
                    'message': 'Request body must be a JSON object.'
                }),
                mimetype='application/json',
                status_code=400
            )

        username = req_body.get('username')
        password = req_body.get('password')
        # print(username, password)

        if not isinstance(username, str) or not isinstance(password, str):
            return func.HttpResponse(
                json.dumps({
                    'error': 'missing_credentials',
                    'message': 'Username and password are required.'
                }),
                mimetype='application/json',
                status_code=400
            )

        username = username.strip()
        if not (username and password):
            return func.HttpResponse(
                json.dumps({
                    'error': 'missing_credentials',
                    'message': 'Username and password are required.'
                }),
                mimetype='application/json',
                status_code=400
            )

        if not checkCredentials(username, password):
            return func.HttpResponse(
                json.dumps({
                    'error': 'invalid_credentials_format',
                    'message': 'Username or password does not meet the required format.'
                }),
                mimetype='application/json',
                status_code=400
            )

        # Establish connection
        connection = connectDB()

        with connection:
            with connection.cursor() as cursor:
                query = 'SELECT username FROM users WHERE username = %s'
                cursor.execute(query, (username,))

                user = cursor.fetchone()

                if user:
                    return func.HttpResponse(
                        json.dumps({
                            'error': 'signup failed',
                            'message': 'Username already exists.'
                        }),
                        mimetype='application/json',
                        status_code=409
                    )

                password_hash = ph.hash(password)

                query = 'INSERT INTO users (username, hashed_password) VALUES (%s, %s)'
            
                cursor.execute(query, (username, password_hash))

        connection.close()

        return func.HttpResponse(
            json.dumps({
                'message': 'Login successful.',
                'username': username
            }),
            mimetype='application/json',
            status_code=200
        )
    
    except Exception as e:
        logging.exception('Login request failed: %s', e)
        return func.HttpResponse(
            json.dumps({
                'error': 'internal_server_error',
                'message': 'An unexpected server error occurred.'
            }),
            mimetype='application/json',
            status_code=500
        )

