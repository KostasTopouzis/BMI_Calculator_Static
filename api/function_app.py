import azure.functions as func
import json, psycopg, os, logging, datetime, re

#####################
# Auxiliary functions
#####################

def checkCredentials(username: str, password: str):
    if len(username) < 8 or len(password) < 8 or re.search(r'[^\w-]', username):
       return False

    return True


#######################
# Environment variables
#######################

# host = os.environ['POSTGRES_HOST']
# database = os.environ['POSTGRES_DATABASE']
# user = os.environ['POSTGRES_USER']
# password = os.environ['POSTGRES_PASSWORD']

##############################
# Instantiating Azure Function
##############################

app = func.FunctionApp()

# This is for testing purposes

# @app.route(route='hello', methods=['GET'])
# def hello(req: func.HttpRequest) -> func.HttpResponse:
#     data = {'message': 'User data is...',
#             'success': True}
    
#     return func.HttpResponse(
#         json.dumps(data),
#         mimetype='application/json',
#         status_code=200
#     )


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

        connection = psycopg.connect(
        host='localhost',
        dbname='bmi_calc_test',
        user='postgres',
        password='marine26#',
        port=5432
        )

        cursor = connection.cursor()

        query = 'SELECT username FROM users WHERE username = %s AND password = %s'

        cursor.execute(query, (username, password))

        user = cursor.fetchone()

        if not user:
            return func.HttpResponse(
                json.dumps({
                    'error': 'authentication_failed',
                    'message': 'Invalid username or password.'
                }),
                mimetype='application/json',
                status_code=401
            )

        cursor.close()
        connection.close()

        return func.HttpResponse(
            json.dumps({
                'message': 'Login successful.',
                'username': user[0]
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
        print(username, password)

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

        connection = psycopg.connect(
        host='localhost',
        dbname='bmi_calc_test',
        user='postgres',
        password='marine26#',
        port=5432
        )

        cursor = connection.cursor()

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
                status_code=401
            )

        query = 'INSERT INTO users (username, password) VALUES (%s, %s)'

        cursor.execute(query, (username, password))

        cursor.close()
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

