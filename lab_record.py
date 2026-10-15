from datetime import date
class LabRecord:
    def __init__(self, lab_id, user_id, test_name, value, test_date, reference_low, reference_high, doctor_notes):
        self.lab_id = lab_id
        self.user_id = user_id
        self.test_name = test_name
        self.value = value
        self.test_date = test_date
        self.reference_low = reference_low
        self.reference_high = reference_high
        self.doctor_notes = doctor_notes



    @staticmethod
    def from_dict(data):
        lab_id = data.get("lab_id")                                       
        user_id = data.get("user_id")
        test_name = data.get("test_name")
        value = data.get("value")
        test_date = date.fromisoformat(data.get("test_date"))
        reference_low = data.get("reference_low")
        reference_high = data.get("reference_high")
        doctor_notes = data.get("doctor_notes")

        return LabRecord(lab_id, user_id, test_name, value, test_date, reference_low, reference_high, doctor_notes)

    def is_in_range(self):
        return self.reference_low <= self.value <= self.reference_high

    @staticmethod
    def from_row(row):
        lab_id = row[0]
        user_id = row[1]
        test_name = row[2]
        value = row[3]
        test_date = date.fromisoformat(row[4])
        reference_low = row[5]
        reference_high = row[6]
        doctor_notes = row[7]
        return LabRecord(lab_id, user_id, test_name, value, test_date, reference_low, reference_high, doctor_notes)