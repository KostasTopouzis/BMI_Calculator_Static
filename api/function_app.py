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
        req_body = req.get_json()
        username = req_body.get('username', '').strip()
        password = req_body.get('password', '')

        if not (username and password):
            return func.HttpResponse(
                json.dumps('Missing credentials'),
                mimetype='application/json',
                status_code=400
            )

        if not checkCredentials(username, password):
            return func.HttpResponse(
                json.dumps('Inappropriate credentials'),
                mimetype='application/json',
                status_code=400
            )

        connection = psycopg.connect(
        host='localhost',
        dbname='experimental',
        user='postgres',
        password='marine26#',
        port=5432
        )

        cursor = connection.cursor()

        query = 'SELECT id, username FROM users WHERE username = %s AND password = %s'

        cursor.execute(query, (username, password))

        user = cursor.fetchone()

        if not user:
            return func.HttpResponse(
                json.dumps('Invalid credentials'),
                mimetype='application/json',
                status_code=401
            )

        cursor.close()
        connection.close()

        return func.HttpResponse(
            json.dumps(user),
            mimetype='application/json',
            status_code=200
        )
    
    except Exception as e:
        logging.exception(f'Database operation failed: {e}')
        return func.HttpResponse(
            '',
            status_code=500
        )


