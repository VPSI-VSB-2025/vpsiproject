from sqlalchemy.orm import Session
from app.models.request import Request
from app.models.patient import Patient
from app.models.appointment import Appointment
from app.schemas.request import RequestCreate

class RequestService:
    @staticmethod
    def create_request(db: Session, request: RequestCreate):
        patient = db.query(Patient).filter(Patient.id == request.patient_id).first()
        appointment = db.query(Appointment).filter(Appointment.id == request.appointment_id).first()
        
        db_request = Request(**request.model_dump())
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        return db_request

    @staticmethod
    def get_request(db: Session, request_id: int):
        return db.query(Request).filter(Request.id == request_id).first()

    @staticmethod
    def get_requests(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Request).offset(skip).limit(limit).all()
