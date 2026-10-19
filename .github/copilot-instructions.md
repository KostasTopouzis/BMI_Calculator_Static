
# API data models:

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