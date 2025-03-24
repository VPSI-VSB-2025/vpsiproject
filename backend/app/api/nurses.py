from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.schemas.nurse import NurseCreate, NurseOut
from app.services.nurse_service import NurseService

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=NurseOut)
def create_nurse(nurse: NurseCreate, db: Session = Depends(get_db)):
    return NurseService.create_nurse(db, nurse)

@router.get("/{nurse_id}", response_model=NurseOut)
def get_nurse(nurse_id: int, db: Session = Depends(get_db)):
    db_nurse = NurseService.get_nurse(db=db, nurse_id=nurse_id)
    if db_nurse is None:
        raise HTTPException(status_code=404, detail="Nurse not found")
    return db_nurse

@router.get("/", response_model=list[NurseOut])
def get_nurses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return NurseService.get_nurses(db=db, skip=skip, limit=limit)

@router.put("/{nurse_id}", response_model=NurseOut)
def update_nurse(nurse_id: int, nurse: NurseCreate, db: Session = Depends(get_db)):
    db_nurse = NurseService.update_nurse(db=db, nurse_id=nurse_id, nurse=nurse)
    if db_nurse is None:
        raise HTTPException(status_code=404, detail="Nurse not found")
    return db_nurse

@router.delete("/{nurse_id}", response_model=NurseOut)
def delete_nurse(nurse_id: int, db: Session = Depends(get_db)):
    db_nurse = NurseService.delete_nurse(db=db, nurse_id=nurse_id)
    if db_nurse is None:
        raise HTTPException(status_code=404, detail="Nurse not found")
    return db_nurse