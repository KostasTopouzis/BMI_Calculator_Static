import azure.functions as func
import json, psycopg, os, logging, datetime

# host = os.environ['POSTGRES_HOST']
# database = os.environ['POSTGRES_DATABASE']
# user = os.environ['POSTGRES_USER']
# password = os.environ['POSTGRES_PASSWORD']

app = func.FunctionApp()

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
        # req_body = req.get_json()
        # username = req_body.get('username', '').strip()
        # password = req_body.get('password', '').strip()

        username = req.form.get('username')
        password = req.form.get('password')
        print(username, password)

        if not (username and password):
            return func.HttpResponse(
                '',
                status_code=403
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

        # Here goes the SQL query code
        cursor.execute(query, (username, password))

        user = cursor.fetchone()

        if not user:
            return func.HttpResponse(
                'Invalid credentials',
                status_code=402
            )

        # logging.info(f'Type: {type(users)}')
        # logging.info(f'Content: {users}')

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
            "TEST FAIL",
            status_code=400
        )


