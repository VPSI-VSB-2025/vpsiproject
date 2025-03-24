from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.schemas.doctor_specialization import DoctorSpecializationCreate, DoctorSpecializationOut
from app.services.doctor_specialization_service import DoctorSpecializationService

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=DoctorSpecializationOut)
def create_doctor_specialization(doctor_specialization: DoctorSpecializationCreate, db: Session = Depends(get_db)):
    return DoctorSpecializationService.create_doctor_specialization(db, doctor_specialization)

@router.get("/{specialization_id}", response_model=DoctorSpecializationOut)
def get_doctor_specialization(specialization_id: int, db: Session = Depends(get_db)):
    db_specialization = DoctorSpecializationService.get_doctor_specialization(db=db, specialization_id=specialization_id)
    if db_specialization is None:
        raise HTTPException(status_code=404, detail="Doctor specialization not found")
    return db_specialization

@router.get("/", response_model=list[DoctorSpecializationOut])
def get_doctor_specializations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return DoctorSpecializationService.get_doctor_specializations(db=db, skip=skip, limit=limit)

@router.put("/{specialization_id}", response_model=DoctorSpecializationOut)
def update_doctor_specialization(specialization_id: int, doctor_specialization: DoctorSpecializationCreate, db: Session = Depends(get_db)):
    db_specialization = DoctorSpecializationService.update_doctor_specialization(
        db=db,
        specialization_id=specialization_id,
        doctor_specialization=doctor_specialization
    )
    if db_specialization is None:
        raise HTTPException(status_code=404, detail="Doctor specialization not found")
    return db_specialization

@router.delete("/{specialization_id}", response_model=DoctorSpecializationOut)
def delete_doctor_specialization(specialization_id: int, db: Session = Depends(get_db)):
    db_specialization = DoctorSpecializationService.delete_doctor_specialization(db=db, specialization_id=specialization_id)
    if db_specialization is None:
        raise HTTPException(status_code=404, detail="Doctor specialization not found")
    return db_specialization