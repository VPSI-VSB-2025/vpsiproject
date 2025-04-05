from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.services.patient_service import PatientService
from app.services.nurse_service import NurseService
from app.services.request_service import RequestService
from app.services.appointment_service import AppointmentService
from app.services.request_type_service import RequestTypeService
from app.services.patient_service import PatientService
from app.models.request import Request
from app.models.patient import Patient
from app.schemas.book_term import BookTermBase, BookTermOut
from datetime import datetime, timezone
import logging

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/book-term", response_model=BookTermOut)
def book_term(request: BookTermBase, db: Session = Depends(get_db)):
    try:
        db.begin()

        patient = PatientService.get_patient_by_pn(db, request.personal_number)

        if not patient:
            patient_data = Patient(
                name=request.name,
                surname=request.surname,
                phone_number=request.phone_number,
                personal_number=request.personal_number
            )
            patient = PatientService.create_patient(db, patient_data)

        nurse = NurseService.get_nurse_by_doctor_id(db, request.doctor_id)
        if not nurse:
            raise HTTPException(status_code=404, detail="Nurse for this doctor not found")

        appointment = AppointmentService.get_appointment(db, request.appointment_id)
        if not appointment:
            raise HTTPException(status_code=404, detail="Appointment not found")

        existing_request = RequestService.check_existing_request(
            db, patient.id, appointment.id, request.doctor_id
        )
        if existing_request:
            raise HTTPException(status_code=400, detail="Request already exists")

        request_type = RequestTypeService.get_request_type(db, request.request_type_id)
        if not request_type:
            raise HTTPException(status_code=404, detail="Request type not found")

        new_request = Request(
            appointment_id=request.appointment_id,
            doctor_id=request.doctor_id,
            patient_id=patient.id,
            nurse_id=nurse.id,
            request_type_id=request_type.id,
            state="pending",
            created=datetime.now(timezone.utc),
            description=request.description
        )

        db.add(new_request) 

        db.commit()

        db.refresh(new_request)  
        db.refresh(patient) 

        return {"message": "OK, created"}

    except Exception as e:
        db.rollback() 
        logging.error(f"Error occurred while booking term: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred. Check server logs for details.")
