from sqlalchemy.orm import Session
from app.models.request import Request
from app.models.request_type import RequestType
from app.models.appointment import Appointment

class TermService:
    @staticmethod
    def get_all_terms(db: Session):
        appointments = db.query(Appointment).all()
        return [TermService.format_appointment(appointment) for appointment in appointments]

    @staticmethod
    def get_appointment_by_id(db: Session, appointment_id: int):
        return db.query(Appointment).filter(Appointment.id == appointment_id).first()

    @staticmethod
    def format_appointment(appointment: Appointment):
        return {
            "kalendar_id": appointment.id,
            "event_type": appointment.event_type,
            "date_from": appointment.date_from,
            "date_to": appointment.date_to,
            "registration_mandatory": appointment.registration_mandatory,
            "zadanky": [TermService.format_request(request) for request in appointment.requests]
        }

    @staticmethod
    def format_request(request: Request):
        return {
            "zadanka_id": request.id,
            "state": request.state,
            "created_at": request.created_at,
            "typ_zadanky": TermService.format_request_type(request.request_type) if request.request_type else None
        }

    @staticmethod
    def format_request_type(request_type: RequestType):
        return {
            "typ_zadanky_id": request_type.id,
            "popis": request_type.description,
            "nazev": request_type.name
        }
