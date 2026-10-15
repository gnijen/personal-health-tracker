import sqlite3
from med_refill import MedRefill

def get_connection():
    conn = sqlite3.connect("app.db")
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def create_tables():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY,
            email TEXT UNIQUE,
            hashed_password TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS medications (
            refill_id INTEGER PRIMARY KEY,
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
            lab_id INTEGER PRIMARY KEY,
            user_id INTEGER,
            test_name TEXT,
            value REAL,
            test_date TEXT,
            reference_low REAL,
            reference_high REAL,
            doctor_notes TEXT,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
                )
    """)

    conn.commit()
    conn.close()

def save_user(user):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (email, hashed_password) VALUES (?, ?)", (user.email, user.hashed_password))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id

def get_user_by_email(email):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    conn.close()
    return row


def save_medication(med):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO medications(user_id, medication_name, dosage, instructions, last_refill_date, days_per_supply, refills_remaining) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (med.user_id, med.medication_name, med.dosage, med.instructions, med.last_refill_date.isoformat(), med.days_per_supply,  med.refills_remaining)
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id


def get_medications_for_user(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM medications WHERE user_id = ?", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [MedRefill.from_row(row) for row in rows]

def save_lab_record(record):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO labs (lab_id, user_id, test_name, value, test_date, reference_low, reference_high, doctor_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (record.lab_id, record.user_id, record.test_name, record.value, record.test_date.isoformat(), record.reference_low, record.reference_high, record.doctor_notes)
    )
    conn.commit()
    new_lab_id = cursor.lastrowid
    conn.close()
    return new_lab_id 