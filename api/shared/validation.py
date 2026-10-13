import re

def validateCredentials(username: str, password: str) -> bool:
    if len(username) < 8 or len(password) < 8 or re.search(r'[^\w-]', username):
       return False

    return True

