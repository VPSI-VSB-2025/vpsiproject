from sqlalchemy.orm import Session
from app.models.request import Request
from app.schemas.request import RequestCreate

class RequestService:
    @staticmethod
    def get_request(db: Session, request_id: int):
        return db.query(Request).filter(Request.id == request_id).first()

    @staticmethod
    def get_requests(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Request).offset(skip).limit(limit).all()

    @staticmethod
    def create_request(db: Session, request: RequestCreate):
        db_request = Request(**request.model_dump())
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        return db_request

    @staticmethod
    def update_request_status(db: Session, request_id: int, new_state: str):
        """Updates the state of a specific request."""
        db_request = db.query(Request).filter(Request.id == request_id).first()
        if db_request:
            db_request.state = new_state
            db.commit()
            db.refresh(db_request)
        return db_request