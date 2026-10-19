import os, psycopg, json

#######################
# Environment variables
#######################

hostAzure = os.environ['POSTGRES_HOST']
databaseAzure = os.environ['POSTGRES_DATABASE']
userAzure = os.environ['POSTGRES_USER']
passwordAzure = os.environ['POSTGRES_PASSWORD']


#####################
# Functions for database connection and data queries
#####################

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

# saves record in records table. Throws exception to be caught in the records.records endpoint. Returns nothing.
def saveRecord(record: dict) -> None:
    user_id = record['user_id']
    weight_kg = record['weightKg']
    height_cm = record['heightCm']
    bmi = record['bmi']
    weight_unit = record['metricWeight']
    height_unit = record['metricHeight']

    query = '''
        INSERT INTO records (
            user_id,
            wt_kg,
            ht_cm,
            bmi,
            wt_unit_original,
            ht_unit_original
        )
        VALUES (%s, %s, %s, %s, %s, %s)
    '''

    with connectDB() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                query,
                (user_id, weight_kg, height_cm, bmi, weight_unit, height_unit)
            )


# # fetches all records from records table. Returns json string.
# def fetchRecord():
#     try:
#         connection = connectDB()

#         cursor = connection.cursor()

#         query = 'SELECT * FROM records'

#         cursor.execute(query)

#         record_data = cursor.fetchall()

#         return json.dumps(record_data)
#     except Exception as e:
        