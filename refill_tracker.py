from med_refill import MedRefill
from datetime import datetime
from datetime import date

class RefillTracker:
    def __init__(self):
        self.medicines = []
        self.next_meds_id = 1

    def add_medication(self, user_id, medication_name, dosage, instructions, last_refill_date, days_per_supply, refills_remaining):
        m = MedRefill(self.next_meds_id, user_id, medication_name, dosage, instructions, last_refill_date, days_per_supply, refills_remaining)
        self.medicines.append(m)
        self.next_meds_id += 1
        return m

    def get_all_medicines(self):
        return self.medicines

    def meds_needing_attention(self):
        return [medication for medication in self.medicines if (date.today()) >= medication.alert_date()]


    def remove_medication(self, targetted_id):
        found = False
        for medicine in self.medicines:
            if medicine.refill_id == targetted_id:
                self.medicines.remove(medicine)
                found = True
    
        if not found:
            return "No medication found with the given ID"









      
