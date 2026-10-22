from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from auth import signup
from storage import create_tables

app = FastAPI()
create_tables()

class SignupRequest(BaseModel):
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