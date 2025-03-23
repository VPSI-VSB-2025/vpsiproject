from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.schemas.doctor import DoctorCreate, DoctorOut
from app.services.doctor_service import DoctorService

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=DoctorOut)
def create_doctor(doctor: DoctorCreate, db: Session = Depends(get_db)):
    return DoctorService.create_doctor(db, doctor)


@router.get("/{doctor_id}", response_model=DoctorOut)
def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    db_doctor = DoctorService.get_doctor(db=db, doctor_id=doctor_id)
    if db_doctor is None:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return db_doctor

@router.get("/", response_model=list[DoctorOut])
def get_doctors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return DoctorService.get_doctors(db=db, skip=skip, limit=limit)

@router.delete("/{doctor_id}", response_model=DoctorOut)
def delete_doctor(doctor_id: int, db: Session = Depends(get_db)):
    db_doctor = DoctorService.delete_doctor(db=db, doctor_id=doctor_id)
    if db_doctor is None:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return db_doctor
