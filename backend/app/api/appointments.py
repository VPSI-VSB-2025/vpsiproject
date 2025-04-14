from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.schemas.appointment import AppointmentCreate, AppointmentOut
from app.services.appointment_service import AppointmentService
from datetime import timezone

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper function to make datetimes timezone-aware (UTC)
def ensure_utc(dt):
    if dt and dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt

@router.post("/", response_model=AppointmentOut)
def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    db_appointment = AppointmentService.create_appointment(db, appointment)
    if db_appointment:
        # Ensure datetimes are UTC aware before returning
        db_appointment.date_from = ensure_utc(db_appointment.date_from)
        db_appointment.date_to = ensure_utc(db_appointment.date_to)
        db_appointment.created_at = ensure_utc(db_appointment.created_at)
    return db_appointment

@router.get("/{appointment_id}", response_model=AppointmentOut)
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    db_appointment = AppointmentService.get_appointment(db=db, appointment_id=appointment_id)
    if db_appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    # Ensure datetimes are UTC aware before returning
    db_appointment.date_from = ensure_utc(db_appointment.date_from)
    db_appointment.date_to = ensure_utc(db_appointment.date_to)
    db_appointment.created_at = ensure_utc(db_appointment.created_at)
    return db_appointment

@router.get("/", response_model=list[AppointmentOut])
def get_appointments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    appointments = AppointmentService.get_appointments(db=db, skip=skip, limit=limit)
    # Ensure datetimes are UTC aware for all appointments in the list
    for appt in appointments:
        appt.date_from = ensure_utc(appt.date_from)
        appt.date_to = ensure_utc(appt.date_to)
        appt.created_at = ensure_utc(appt.created_at)
    return appointments
