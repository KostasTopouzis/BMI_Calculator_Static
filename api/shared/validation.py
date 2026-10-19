import re

def validateCredentials(username: str, password: str) -> bool:
    if len(username) < 8 or len(password) < 8 or re.search(r'[^\w-]', username):
       return False

    return True

# validates record
def validateRecord(record: dict) -> bool:
    if not isinstance(record, dict):
        return False

    if record.get('metricHeight') not in ('feet', 'meters'):
        return False

    if record.get('metricWeight') not in ('kg', 'pd'):
        return False

    height_cm = record.get('heightCm')
    weight_kg = record.get('weightKg')
    if (
        isinstance(height_cm, bool)
        or not isinstance(height_cm, (int, float))
        or isinstance(weight_kg, bool)
        or not isinstance(weight_kg, (int, float))
    ):
        return False

    try:
        if not (0 < height_cm < float('inf') and 0 < weight_kg < float('inf')):
            return False
    except OverflowError:
        return False

    return True
