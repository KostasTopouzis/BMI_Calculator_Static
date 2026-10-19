import azure.functions as func
import json, logging

from shared.authentication import authenticateUser
from shared.validation import validateCredentials, validateRecord
# from shared.database import saveRecord, fetchRecord

bp = func.Blueprint()

@bp.route (route='records', methods=['GET', 'POST'])
def records(req: func.HttpRequest) -> func.HttpResponse:
  if req.method == 'GET':
    try:
      # record_json = fetchRecord()                 # some scenario for resource not found

      return func.HttpResponse(
            json.dumps({
                'message': 'Record successfuly fetched.',
                'data': '' # record_json
            }),
            mimetype='application/json',
            status_code=200
        )                 # succesful fetch
    except Exception as e:
      return func.HttpResponse(
            json.dumps({
                'error': 'internal_server_error',
                'message': 'An unexpected server error occurred.'
            }),
            mimetype='application/json',
            status_code=500
        )               # something went wrong with fetching from the database


  if req.method == 'POST':
      record = json.loads(req.get_json())
      # print(type(record))
      # print(record)
      isValidRecord = validateRecord(record)
      # isValidRecord = 1
    
      if isValidRecord:
        try:
          # saveRecord(record_json)

          return func.HttpResponse(
            json.dumps({
                'message': 'Record successfuly saved.'
            }),
            mimetype='application/json',
            status_code=200
        )                        # succesful save of record to database

        except Exception as e:
          return func.HttpResponse(
            json.dumps({
                'error': 'internal_server_error',
                'message': 'An unexpected server error occurred.'
            }),
            mimetype='application/json',
            status_code=500
        )                                            # something went wrong with saving the record in the database

      return func.HttpResponse(
         json.dumps({
           'error': 'invalid_record_format', 
           'message': 'Record does not meet the required format.'
          }),
         mimetype='application/json',
         status_code=400)                        # the record sent in the request is invalid


