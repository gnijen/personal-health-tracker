class User:
    def __init__(self, user_id, email, hashed_password):
        self.user_id = user_id
        self.email = email
        self.hashed_password = hashed_password

    @staticmethod
    def from_row(row):
        user_id = row[0]
        email = row[1]
        hashed_password = row[2]
        return User(user_id, email, hashed_password)