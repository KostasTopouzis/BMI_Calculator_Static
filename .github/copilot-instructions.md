
## Function structure

Keep strictly to the designated structures. If there ever is a reason to deviate from it,
ask my permission first and explain your reasons for the proposed deviation.

### Validation functions

All validation functions in the API/shared/ folder have the structure:

```python
def validateFunction(some arg) -> bool:
    if ...:    # invalid case 
        return False

    return True  # valid case
```

### API Endpoint Functions

API endpoint functions in the API/endpoints/ folders have this general structure:

```python
@bp.route(route='endpointFunction', methods=[appropriate methods here])
def endpointFunction(req: func.HttpRequest) -> func.HttpResponse:
    try:
        try:
            # try to do something
        except AppropriateException:
            return func.HttpResponse(
                json.dumps({
                    'error': 'some error message',
                    'message': 'appropriate message'
                }),
                mimetype='application/json',
                status_code=appropriate code
            )

        if not # some check:
            return func.HttpResponse(
              # same type as above
                        )

        # as many if not's as necessary to catch more specific errors of status code 4xx

        # If all checks have passed, establish connection
        connection = connectDB()

        # if absolutely necessary, call authenticateUser in shared/authentication.py 
        # to check user credentials before proceeding.

        # Do what necessary with connection here.
        # Store it in a variable, so you can pass it in the success return below

        connection.close()

        # Success case return
        return func.HttpResponse(
            json.dumps({
                'message': 'success_message',
                'username': username
            }),
            mimetype='application/json',
            status_code=200
        )
    
    # This except corresponding to the most outer try catches general 5xx server errors
    except Exception as e:
        logging.exception('Login request failed: %s', e)
        return func.HttpResponse(
            json.dumps({
                'error': 'some_server_error',
                'message': 'appropriate message'
            }),
            mimetype='application/json',
            status_code=5xx code
        )
```


## API data models:

shared/validation.py:

This is the expected data model that validateRecord() expects:

Expected data model:

{
'metricHeight': str ('feet' | 'meters')
'metricWeight': str ('kg' | 'pd'),
'heightCm': float,
'weightKg': float
}

shared/database.py:

This is the database model used in the app. 

id SERIAL
user_id INTEGER
wt_kg NUMERIC(5, 2)
ht_cm NUMERIC(5, 2)
bmi NUMERIC(2, 2)
wt_unit_original WEIGHT_UNIT ENUM ('kg | 'pd')
ht_unit_original HEIGHT_UNIT ENUM ('feet' | 'cm')
created_at TIMESTAMP

The saveRecord() middleware needs to transform any data it received to a Python dict of equivalent type before sending a query to the database.