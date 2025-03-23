from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.schemas.patient import PatientCreate, PatientOut
from app.services.patient_service import PatientService

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=PatientOut)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    return PatientService.create_patient(db, patient)

@router.get("/{patient_id}", response_model=PatientOut)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = PatientService.get_patient(db=db, patient_id=patient_id)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient

@router.get("/", response_model=list[PatientOut])
def get_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return PatientService.get_patients(db=db, skip=skip, limit=limit)

@router.delete("/{patient_id}", response_model=PatientOut)
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = PatientService.delete_patient(db=db, patient_id=patient_id)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient