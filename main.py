from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from auth import signup,login, create_token
from storage import create_tables

app = FastAPI()
create_tables()

class SignupRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@app.get("/")
def home():
    return {"message": "Health tracker API is running"}

@app.post("/signup")
def signup_route(data: SignupRequest):
    user = signup(data.email, data.password)
    if user is None:
        raise HTTPException(status_code=400, detail="Email already registered")
    return {"user_id": user.user_id, "email": user.email}

@app.post("/login")
def login_route(data:LoginRequest):
    user = login(data.email, data.password)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(user.user_id)
    return {"access_token": token, "token_type": "bearer"}