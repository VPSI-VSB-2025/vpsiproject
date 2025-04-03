from sqlalchemy.orm import Session
from app.models.doctor import Doctor
from app.schemas.doctor import DoctorCreate

class DoctorService:
    @staticmethod
    def create_doctor(db: Session, doctor: DoctorCreate):
        # Changed from doctor.dict() to doctor.model_dump() for Pydantic v2 compatibility
        db_doctor = Doctor(**doctor.model_dump())
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
    def update_doctor(db: Session, doctor_id: int, doctor: DoctorCreate):
        db_doctor = DoctorService.get_doctor(db, doctor_id)
        if db_doctor:
            db_doctor.name = doctor.name
            db_doctor.surname = doctor.surname
            db_doctor.email = doctor.email
            db_doctor.phone_number = doctor.phone_number

            if doctor.doctor_specialization:
                db_doctor.specialization_id = doctor.doctor_specialization
            db.commit()
            db.refresh(db_doctor)
        return db_doctor

    @staticmethod
    def delete_doctor(db: Session, doctor_id: int):
        db_doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
        if db_doctor:
            db.delete(db_doctor)
            db.commit()
        return db_doctor
