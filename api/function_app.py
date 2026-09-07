import azure.functions as func
import datetime
import json
import logging

app = func.FunctionApp()

@app.route(route='hello', methods=['GET'])
def hello(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse('Hello, there!')