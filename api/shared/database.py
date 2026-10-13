import os, psycopg

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