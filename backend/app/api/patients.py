from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import services
from app.core.database import SessionLocal
from app.schemas import PatientCreate, PatientOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/patients/", response_model=PatientOut)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    return services.PatientService.create_patient(db, patient)

@router.get("/patients/{patient_id}", response_model=PatientOut)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = services.PatientService.get_patient(db=db, patient_id=patient_id)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient

@router.get("/patients/", response_model=list[PatientOut])
def get_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return services.PatientService.get_patients(db=db, skip=skip, limit=limit)

@router.delete("/patients/{patient_id}", response_model=PatientOut)
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = services.PatientService.delete_patient(db=db, patient_id=patient_id)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient