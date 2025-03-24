from sqlalchemy.orm import Session
from app.models.nurse import Nurse
from app.schemas.nurse import NurseCreate


class NurseService:
    @staticmethod
    def create_nurse(db: Session, nurse: NurseCreate):
        # Using model_dump() for Pydantic v2 compatibility
        nurse_data = nurse.model_dump()
        db_nurse = Nurse(**nurse_data)
        db.add(db_nurse)
        db.commit()
        db.refresh(db_nurse)
        return db_nurse

    @staticmethod
    def get_nurse(db: Session, nurse_id: int):
        return db.query(Nurse).filter(Nurse.id == nurse_id).first()

    @staticmethod
    def get_nurses(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Nurse).offset(skip).limit(limit).all()

    @staticmethod
    def update_nurse(db: Session, nurse_id: int, nurse: NurseCreate):
        db_nurse = NurseService.get_nurse(db, nurse_id)
        if db_nurse:
            nurse_data = nurse.model_dump()
            for key, value in nurse_data.items():
                setattr(db_nurse, key, value)
            db.commit()
            db.refresh(db_nurse)
        return db_nurse

    @staticmethod
    def delete_nurse(db: Session, nurse_id: int):
        db_nurse = NurseService.get_nurse(db, nurse_id)
        if db_nurse:
            db.delete(db_nurse)
            db.commit()
        return db_nurse