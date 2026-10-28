from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from auth import signup, login, create_token, verify_token
from storage import create_tables, get_medications_for_user, save_medication, delete_medication
from med_refill import MedRefill
from datetime import date


app = FastAPI()
create_tables()

class SignupRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class MedicationRequest(BaseModel):
    medication_name: str
    dosage: str
    instructions: str
    last_refill_date: date
    days_per_supply: int
    refills_remaining: int

bearer = HTTPBearer()

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

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(bearer)):
    payload = verify_token(creds.credentials)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload["user_id"]

@app.get("/medications")
def my_medications(user_id: int = Depends(get_current_user)):
    meds = get_medications_for_user(user_id)
    return [med.to_dict() for med in meds]

@app.post("/medications")
def add_medication(data: MedicationRequest, user_id: int = Depends(get_current_user)):
    med = MedRefill(None, user_id, data.medication_name, data.dosage, data.instructions, data.last_refill_date, data.days_per_supply, data.refills_remaining)
    new_id = save_medication(med)
    med.refill_id = new_id
    return med.to_dict()

@app.delete("/medications/{refill_id}")
def remove_medication(refill_id: int, user_id: int = Depends(get_current_user)):
    deleted = delete_medication(refill_id, user_id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Medication not found")
    return {"message": "Medication deleted", "refill_id": refill_id}