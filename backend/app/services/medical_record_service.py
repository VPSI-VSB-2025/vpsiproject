from sqlalchemy.orm import Session
from app.models.medical_record import MedicalRecord
from app.schemas.medical_record import MedicalRecordCreate

class MedicalRecordService:
    @staticmethod
    def create_medical_record(db: Session, medical_record: MedicalRecordCreate):
        db_medical_record = MedicalRecord(**medical_record.dict())
        db.add(db_medical_record)
        db.commit()
        db.refresh(db_medical_record)
        return db_medical_record

    @staticmethod
    def get_medical_record(db: Session, medical_record_id: int):
        return db.query(MedicalRecord).filter(MedicalRecord.id == medical_record_id).first()

    @staticmethod
    def get_medical_records(db: Session, skip: int = 0, limit: int = 100):
        return db.query(MedicalRecord).offset(skip).limit(limit).all()

    @staticmethod
    def delete_medical_record(db: Session, medical_record_id: int):
        db_medical_record = db.query(MedicalRecord).filter(MedicalRecord.id == medical_record_id).first()
        if db_medical_record:
            db.delete(db_medical_record)
            db.commit()
        return db_medical_record
