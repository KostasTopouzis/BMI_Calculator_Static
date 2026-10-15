import psycopg # is this import necessary?
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()

def authenticateUser(connection, username, raw_password) -> bool:
    with connection:
        with connection.cursor() as cursor:
            query = 'SELECT hashed_password FROM users WHERE username = %s'
            cursor.execute(query, (username,))

            row = cursor.fetchone()

            if not row:
                return False

            stored_hash = row[0]

            try:
                ph.verify(stored_hash, raw_password)

                if ph.check_needs_rehash(stored_hash):
                    new_hash = ph.hash(raw_password)
                    query = 'UPDATE users SET hashed_password = %s WHERE username = %s'
                    cursor.execute(query, (new_hash, username))

                return True

            except VerifyMismatchError:
                return False
