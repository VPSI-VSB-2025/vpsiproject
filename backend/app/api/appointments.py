from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.schemas.appointment import AppointmentCreate, AppointmentOut
from app.services.appointment_service import AppointmentService

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=AppointmentOut)
def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    return AppointmentService.create_appointment(db, appointment)

@router.get("/{appointment_id}", response_model=AppointmentOut)
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    db_appointment = AppointmentService.get_appointment(db=db, appointment_id=appointment_id)
    if db_appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return db_appointment

@router.get("/", response_model=list[AppointmentOut])
def get_appointments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return AppointmentService.get_appointments(db=db, skip=skip, limit=limit)
