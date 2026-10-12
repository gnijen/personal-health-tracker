import sqlite3

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
        "INSERT INTO medications (user_id, medication_name, dosage, instructions, last_refill_date, days_per_supply, refills_remaining) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (med.user_id, med.medication_name, med.dosage, med.instructions, med.last_refill_date.isoformat(), med.days_per_supply,  med.refills_remaining)
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id