import azure.functions as func
import json

app = func.FunctionApp()

@app.route(route='hello', methods=['GET'])
def hello(req: func.HttpRequest) -> func.HttpResponse:
    data = {'message': 'User data is...',
            'success': True}
    
    return func.HttpResponse(
        json.dumps(data)
        mimetype='application/json',
        status_code=200
    )