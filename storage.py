import os
import psycopg
from dotenv import load_dotenv
from med_refill import MedRefill
from lab_record import LabRecord

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")

def get_connection():
    return psycopg.connect(DATABASE_URL)

def create_tables():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            email TEXT UNIQUE,
            hashed_password TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS medications (
            medication_id SERIAL PRIMARY KEY,
            user_id INTEGER,
            medication_name TEXT,
            dosage TEXT,
            instructions TEXT,
            last_refill_date TEXT,
            days_per_supply INTEGER,
            refills_remaining INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS labs (
            lab_id SERIAL PRIMARY KEY,
            user_id INTEGER,
            test_name TEXT,
            value DOUBLE PRECISION,
            test_date TEXT,
            reference_low DOUBLE PRECISION,
            reference_high DOUBLE PRECISION,
            doctor_notes TEXT,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
    """)
    conn.commit()
    conn.close()

def save_user(user):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (email, hashed_password) VALUES (%s, %s) RETURNING user_id",  
        (user.email, user.hashed_password)
    )
    new_id = cursor.fetchone()[0]  
    conn.commit()
    conn.close()
    return new_id

def get_user_by_email(email):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))  
    row = cursor.fetchone()
    conn.close()
    return row

def save_medication(med):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO medications (user_id, medication_name, dosage, instructions, last_refill_date, days_per_supply, refills_remaining) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING medication_id",  
        (med.user_id, med.medication_name, med.dosage, med.instructions,
         med.last_refill_date.isoformat(), med.days_per_supply, med.refills_remaining)
    )
    new_id = cursor.fetchone()[0]  
    conn.commit()
    conn.close()
    return new_id

def get_medications_for_user(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM medications WHERE user_id = %s", (user_id,))  
    rows = cursor.fetchall()
    conn.close()
    return [MedRefill.from_row(row) for row in rows]

def save_lab_record(record):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO labs (user_id, test_name, value, test_date, reference_low, reference_high, doctor_notes) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING lab_id",  
        (record.user_id, record.test_name, record.value, record.test_date.isoformat(),
         record.reference_low, record.reference_high, record.doctor_notes)
    )
    new_lab_id = cursor.fetchone()[0] 
    conn.commit()
    conn.close()
    return new_lab_id

def get_labs_for_user(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM labs WHERE user_id = %s", (user_id,))  
    rows = cursor.fetchall()
    conn.close()
    return [LabRecord.from_row(row) for row in rows]

def delete_medication(medication_id, user_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM medications WHERE medication_id = %s AND user_id = %s",  
        (medication_id, user_id)
    )
    deleted = cursor.rowcount
    conn.commit()
    conn.close()
    return deleted