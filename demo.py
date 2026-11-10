import secrets
from datetime import date, timedelta
from auth import signup
from user import User
from med_refill import MedRefill
from lab_record import LabRecord
from storage import get_user_by_email, delete_all_data_for_user, save_medication, save_lab_record

DEMO_EMAIL = "demo@example.com"


def get_demo_user():
    row = get_user_by_email(DEMO_EMAIL)
    if row is not None:
        return User.from_row(row)
    # Random password: nobody can sign in to the demo with a password, only through /demo
    user = signup(DEMO_EMAIL, secrets.token_urlsafe(32), "Alex")
    if user is None:
        # Two people clicked at the same moment and the other request created it first
        user = User.from_row(get_user_by_email(DEMO_EMAIL))
    return user


def reset_demo_account():
    user = get_demo_user()
    delete_all_data_for_user(user.user_id)
    today = date.today()

    medicines = [
        # 10 days left -> pharmacy refill alert
        MedRefill(None, user.user_id, "Metformin", "500mg", "Twice daily with meals",
                  today - timedelta(days=20), 30, 2),
        # 25 days left -> no alert
        MedRefill(None, user.user_id, "Lisinopril", "10mg", "Once daily in the morning",
                  today - timedelta(days=5), 30, 3),
        # 10 days left, no refills -> "book your doctor" alert
        MedRefill(None, user.user_id, "Atorvastatin", "20mg", "Once daily at bedtime",
                  today - timedelta(days=80), 90, 0),
        # 78 days left -> full bar
        MedRefill(None, user.user_id, "Levothyroxine", "50mcg", "Once daily on an empty stomach",
                  today - timedelta(days=12), 90, 4),
        # 35 days left -> no alert
        MedRefill(None, user.user_id, "Vitamin D3", "1000 IU", "Once daily with food",
                  today - timedelta(days=25), 60, 5),
        # 4 days left -> pharmacy refill alert, nearly empty bar
        MedRefill(None, user.user_id, "Omeprazole", "20mg", "Once daily before breakfast",
                  today - timedelta(days=26), 30, 1),
    ]
    for med in medicines:
        save_medication(med)

    labs = [
        LabRecord(None, user.user_id, "HbA1c", 6.8, today - timedelta(days=12), 4.0, 5.6,
                  "Slightly high. Recheck in 3 months."),
        LabRecord(None, user.user_id, "Fasting glucose", 118, today - timedelta(days=12), 70, 99,
                  "Above range. Discuss at next visit."),
        LabRecord(None, user.user_id, "LDL cholesterol", 95, today - timedelta(days=12), 0, 100,
                  "Within target."),
        LabRecord(None, user.user_id, "TSH", 2.1, today - timedelta(days=40), 0.4, 4.0,
                  "Normal."),
        LabRecord(None, user.user_id, "Vitamin D", 32, today - timedelta(days=40), 30, 100,
                  "Low end of normal."),
        LabRecord(None, user.user_id, "Potassium", 4.2, today - timedelta(days=40), 3.5, 5.1,
                  ""),
    ]
    for lab in labs:
        save_lab_record(lab)

    return user