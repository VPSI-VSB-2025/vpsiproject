from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.request_type import RequestType
from app.schemas.request_type import RequestTypeCreate, RequestTypeOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=RequestTypeOut)
def create_request_type(request_type: RequestTypeCreate, db: Session = Depends(get_db)):
    db_request_type = RequestType(**request_type.dict())
    db.add(db_request_type)
    db.commit()
    db.refresh(db_request_type)
    return db_request_type

@router.get("/", response_model=list[RequestTypeOut])
def get_request_types(db: Session = Depends(get_db)):
    return db.query(RequestType).all()

@router.get("/{request_type_id}", response_model=RequestTypeOut)
def get_request_type(request_type_id: int, db: Session = Depends(get_db)):
    db_request_type = db.query(RequestType).filter(RequestType.id == request_type_id).first()
    if db_request_type is None:
        raise HTTPException(status_code=404, detail="RequestType not found")
    return db_request_type
