from passlib.context import CryptContext
from user import User
import jwt
from datetime import datetime, timedelta, timezone
from storage import get_user_by_email, save_user
import sqlite3
import os
from dotenv import load_dotenv


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def signup(email, plain_password):
    
    hashed_password = pwd_context.hash(plain_password)
    new_user = User(None, email, hashed_password)
    try:
        new_id = save_user(new_user)
        new_user.user_id = new_id
        return new_user
    except sqlite3.IntegrityError:
        return None

def login(email, plain_password):
    row = get_user_by_email(email)
    if row is None:
        return None
    user = User.from_row(row)
    if pwd_context.verify(plain_password, user.hashed_password):
        return user
    else:
        return None

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not set")

def create_token(user_id):
    payload = {
        "user_id" : user_id,
        "exp" : datetime.now(timezone.utc) + timedelta(hours=24)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def verify_token(token):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded
    except jwt.InvalidTokenError:
        return None