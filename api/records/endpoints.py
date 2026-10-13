import azure.functions as func
import json, logging

from shared.authentication import authenticateUser
from shared.validation import validateCredentials
from shared.database import connectDB

bp = func.Blueprint()

@bp.route(route='records', methods=['GET', 'POST'])
def records(req: func.HttpRequest) -> func.HttpResponse:
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

        if not validateCredentials(username, password):
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