class User:
    def __init__(self, user_id, email, hashed_password, first_name=None):
        self.user_id = user_id
        self.email = email
        self.hashed_password = hashed_password
        self.first_name = first_name

    @staticmethod
    def from_row(row):
        user_id = row[0]
        email = row[1]
        hashed_password = row[2]
        first_name = row[3]
        return User(user_id, email, hashed_password, first_name)