from lab_record import LabRecord

class LabTracker:
    def __init__(self):
        self.lab_records = []
        self.next_record_id = 1

    def add_lab_records(self, user_id, test_name, value, test_date, reference_low, reference_high, doctor_notes):
            l = LabRecord(self.next_record_id, user_id, test_name, value, test_date, reference_low, reference_high, doctor_notes)
            self.lab_records.append(l)
            self.next_record_id += 1
            return l

    def get_all_records(self):
            return self.lab_records

    def remove_lab_records(self, removal_id):
            found = False
            for record in self.lab_records:
                if record.lab_id == removal_id:
                    self.lab_records.remove(record)
                    found = True
        
            if not found:
                return "No lab records found with the given ID."

    def get_recent_history(self):
        return sorted(self.lab_records, key=lambda record: record.test_date, reverse=True)
