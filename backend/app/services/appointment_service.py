from sqlalchemy.orm import Session
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate

class AppointmentService:
    @staticmethod
    def create_appointment(db: Session, appointment: AppointmentCreate):
        db_appointment = Appointment(**appointment.dict())
        db.add(db_appointment)
        db.commit()
        db.refresh(db_appointment)
        return db_appointment
    
    @staticmethod
    def get_appointment(db: Session, appointment_id: int):
        return db.query(Appointment).filter(Appointment.id == appointment_id).first()

    @staticmethod
    def get_appointments(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Appointment).offset(skip).limit(limit).all()
