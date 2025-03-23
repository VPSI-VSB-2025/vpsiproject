from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.schemas.medical_record import MedicalRecordCreate, MedicalRecordOut
from app.services.medical_record_service import MedicalRecordService

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=MedicalRecordOut)
def create_medical_record(medical_record: MedicalRecordCreate, db: Session = Depends(get_db)):
    return MedicalRecordService.create_medical_record(db, medical_record)

@router.get("/{medical_record_id}", response_model=MedicalRecordOut)
def get_medical_record(medical_record_id: int, db: Session = Depends(get_db)):
    db_medical_record = MedicalRecordService.get_medical_record(db=db, medical_record_id=medical_record_id)
    if db_medical_record is None:
        raise HTTPException(status_code=404, detail="Medical record not found")
    return db_medical_record

@router.get("/", response_model=list[MedicalRecordOut])
def get_medical_records(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return MedicalRecordService.get_medical_records(db=db, skip=skip, limit=limit)

@router.delete("/{medical_record_id}", response_model=MedicalRecordOut)
def delete_medical_record(medical_record_id: int, db: Session = Depends(get_db)):
    db_medical_record = MedicalRecordService.delete_medical_record(db=db, medical_record_id=medical_record_id)
    if db_medical_record is None:
        raise HTTPException(status_code=404, detail="Medical record not found")
    return db_medical_record
