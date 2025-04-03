from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.schemas.request_type import RequestTypeCreate, RequestTypeOut
from app.services.request_type_service import RequestTypeService

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=RequestTypeOut)
def create_request_type(request_type: RequestTypeCreate, db: Session = Depends(get_db)):
    return RequestTypeService.create_request_type(db, request_type)

@router.get("/{request_type_id}", response_model=RequestTypeOut)
def get_request_type(request_type_id: int, db: Session = Depends(get_db)):
    db_request_type = RequestTypeService.get_request_type(db=db, request_type_id=request_type_id)
    if db_request_type is None:
        raise HTTPException(status_code=404, detail="Request type not found")
    return db_request_type

@router.get("/", response_model=list[RequestTypeOut])
def get_request_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return RequestTypeService.get_request_types(db=db, skip=skip, limit=limit)

@router.put("/{request_type_id}", response_model=RequestTypeOut)
def update_request_type(request_type_id: int, request_type: RequestTypeCreate, db: Session = Depends(get_db)):
    db_request_type = RequestTypeService.update_request_type(db=db, request_type_id=request_type_id, request_type=request_type)
    if db_request_type is None:
        raise HTTPException(status_code=404, detail="Request type not found")
    return db_request_type

@router.delete("/{request_type_id}", response_model=RequestTypeOut)
def delete_request_type(request_type_id: int, db: Session = Depends(get_db)):
    db_request_type = RequestTypeService.delete_request_type(db=db, request_type_id=request_type_id)
    if db_request_type is None:
        raise HTTPException(status_code=404, detail="Request type not found")
    return db_request_type
