from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
# Import RequestUpdate schema
from app.schemas.request import RequestCreate, RequestOut, RequestUpdate
from app.services.request_service import RequestService

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=RequestOut)
def create_request(request: RequestCreate, db: Session = Depends(get_db)):
    return RequestService.create_request(db, request)

@router.put("/{request_id}", response_model=RequestOut)
def update_request(
    request_id: int,
    request_update: RequestUpdate,  # Use the new RequestUpdate schema
    db: Session = Depends(get_db)
):
    db_request = RequestService.update_request_status(
        db=db, request_id=request_id, new_state=request_update.state
    )
    if db_request is None:
        raise HTTPException(status_code=404, detail="Request not found")
    return db_request

@router.get("/{request_id}", response_model=RequestOut)
def get_request(request_id: int, db: Session = Depends(get_db)):
    db_request = RequestService.get_request(db=db, request_id=request_id)
    if db_request is None:
        raise HTTPException(status_code=404, detail="Request not found")
    return db_request

@router.get("/", response_model=list[RequestOut])
def get_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return RequestService.get_requests(db=db, skip=skip, limit=limit)
