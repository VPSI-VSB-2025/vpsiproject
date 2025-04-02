from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.services.list_all_terms_service import TermService
from app.schemas.list_all_terms import TermOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/list-all-terms", response_model=list[TermOut])
def list_all_terms(db: Session = Depends(get_db)):
    terms = TermService.get_all_terms(db)
    if not terms:
        raise HTTPException(status_code=404, detail="No terms found")
    return terms
