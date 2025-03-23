from sqlalchemy.orm import Session
from models import Patient  
from schemas import PatientCreate

class PatientService:
    @staticmethod
    def create_patient(db: Session, patient: PatientCreate):
        db_patient = Patient(**patient.dict())  
        db.add(db_patient)
        db.commit()
        db.refresh(db_patient) 
        return db_patient

    @staticmethod
    def get_patient(db: Session, patient_id: int):
        return db.query(Patient).filter(Patient.id == patient_id).first()

    @staticmethod
    def get_patients(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Patient).offset(skip).limit(limit).all()

    @staticmethod
    def delete_patient(db: Session, patient_id: int):
        db_patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if db_patient:
            db.delete(db_patient)
            db.commit()
        return db_patient
