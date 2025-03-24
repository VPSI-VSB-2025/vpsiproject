from sqlalchemy.orm import Session
from app.models.doctor_specialization import DoctorSpecialization
from app.schemas.doctor_specialization import DoctorSpecializationCreate


class DoctorSpecializationService:
    @staticmethod
    def create_doctor_specialization(db: Session, doctor_specialization: DoctorSpecializationCreate):
        # Using model_dump() for Pydantic v2 compatibility
        specialization_data = doctor_specialization.model_dump()
        db_specialization = DoctorSpecialization(**specialization_data)
        db.add(db_specialization)
        db.commit()
        db.refresh(db_specialization)
        return db_specialization

    @staticmethod
    def get_doctor_specialization(db: Session, specialization_id: int):
        return db.query(DoctorSpecialization).filter(DoctorSpecialization.id == specialization_id).first()

    @staticmethod
    def get_doctor_specializations(db: Session, skip: int = 0, limit: int = 100):
        return db.query(DoctorSpecialization).offset(skip).limit(limit).all()

    @staticmethod
    def update_doctor_specialization(db: Session, specialization_id: int, doctor_specialization: DoctorSpecializationCreate):
        db_specialization = DoctorSpecializationService.get_doctor_specialization(db, specialization_id)
        if db_specialization:
            specialization_data = doctor_specialization.model_dump()
            for key, value in specialization_data.items():
                setattr(db_specialization, key, value)
            db.commit()
            db.refresh(db_specialization)
        return db_specialization

    @staticmethod
    def delete_doctor_specialization(db: Session, specialization_id: int):
        db_specialization = DoctorSpecializationService.get_doctor_specialization(db, specialization_id)
        if db_specialization:
            db.delete(db_specialization)
            db.commit()
        return db_specialization