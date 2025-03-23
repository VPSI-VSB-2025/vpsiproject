from sqlalchemy.orm import Session
from app.models.doctor import Doctor
from app.schemas.doctor import DoctorCreate

class DoctorService:
    @staticmethod
    def create_doctor(db: Session, doctor: DoctorCreate):
        db_doctor = Doctor(**doctor.dict())
        db.add(db_doctor)
        db.commit()
        db.refresh(db_doctor)
        return db_doctor

    @staticmethod
    def get_doctor(db: Session, doctor_id: int):
        return db.query(Doctor).filter(Doctor.id == doctor_id).first()

    @staticmethod
    def get_doctors(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Doctor).offset(skip).limit(limit).all()

    @staticmethod
    def delete_doctor(db: Session, doctor_id: int):
        db_doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
        if db_doctor:
            db.delete(db_doctor)
            db.commit()
        return db_doctor
