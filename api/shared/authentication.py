import os

import psycopg # is this import necessary?
import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()

def authenticateUser(connection, username, raw_password) -> int | None:
    with connection:
        with connection.cursor() as cursor:
            query = 'SELECT id, hashed_password FROM users WHERE username = %s'
            cursor.execute(query, (username,))

            row = cursor.fetchone()

            if not row:
                return None

            user_id, stored_hash = row

            try:
                ph.verify(stored_hash, raw_password)

                if ph.check_needs_rehash(stored_hash):
                    new_hash = ph.hash(raw_password)
                    query = 'UPDATE users SET hashed_password = %s WHERE username = %s'
                    cursor.execute(query, (new_hash, username))

                return user_id

            except VerifyMismatchError:
                return None


def getAuthenticatedUserId(authorization_header: str | None) -> int | None:
    if not authorization_header:
        return None

    scheme, separator, token = authorization_header.partition(' ')
    if scheme.lower() != 'bearer' or not separator or not token:
        return None

    try:
        claims = jwt.decode(
            token,
            os.environ['AUTH_TOKEN_SECRET'],
            algorithms=['HS256'],
            options={'require': ['sub', 'exp']}
        )
    except jwt.InvalidTokenError:
        return None

    subject = claims.get('sub')
    if not isinstance(subject, str) or not subject.isascii() or not subject.isdecimal():
        return None

    try:
        user_id = int(subject)
    except ValueError:
        return None

    return user_id if user_id > 0 else None
