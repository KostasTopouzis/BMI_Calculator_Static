import azure.functions as func
import json, psycopg, os, logging, datetime

host = os.environ['POSTGRES_HOST']
database = os.environ['POSTGRES_DATABASE']
user = os.environ['POSTGRES_USER']
password = os.environ['POSTGRES_PASSWORD']

app = func.FunctionApp()

@app.route(route='hello', methods=['GET'])
def hello(req: func.HttpRequest) -> func.HttpResponse:
    data = {'message': 'User data is...',
            'success': True}
    
    return func.HttpResponse(
        json.dumps(data),
        mimetype='application/json',
        status_code=200
    )

@app.route(route='login', methods=['GET'])
def login(req: func.HttpRequest) -> func.HttpResponse:
    connection = psycopg.connect(
    host=host,
    dbname=database,
    user=user,
    password=password,
    port=5432
    )

    cursor = connection.cursor()

    # Here goes the SQL query code
    cursor.execute(
        "SELECT * FROM users"
    )

    users = cursor.fetchall()

    # logging.info('Type: %s', type(users))
    # logging.info('Content: %s', users)

    for idx, user in enumerate(users):
        users[idx] = *user[:-1], user[-1].isoformat()

    # logging.info('Type: %s', type(users))
    # logging.info('Content: %s', users)

    cursor.close()
    connection.close()

    return func.HttpResponse(
        json.dumps(users),
        mimetype='application/json',
        status_code=200
    )
