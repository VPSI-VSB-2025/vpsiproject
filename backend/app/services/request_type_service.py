from sqlalchemy.orm import Session
from app.models.request_type import RequestType
from app.schemas.request_type import RequestTypeCreate, RequestTypeOut

class RequestTypeService:
    @staticmethod
    def create_request_type(db: Session, request_type: RequestTypeCreate):
        db_request_type = RequestType(**request_type.model_dump())
        db.add(db_request_type)
        db.commit()
        db.refresh(db_request_type)
        return db_request_type

    @staticmethod
    def get_request_type(db: Session, request_type_id: int):
        return db.query(RequestType).filter(RequestType.id == request_type_id).first()

    @staticmethod
    def get_request_types(db: Session, skip: int = 0, limit: int = 100):
        return db.query(RequestType).offset(skip).limit(limit).all()

    @staticmethod
    def update_request_type(db: Session, request_type_id: int, request_type: RequestTypeCreate):
        db_request_type = RequestTypeService.get_request_type(db, request_type_id)
        if db_request_type:
            db_request_type.name = request_type.name
            db_request_type.description = request_type.description
            db_request_type.length = request_type.length
            db.commit()
            db.refresh(db_request_type)
        return db_request_type

    @staticmethod
    def delete_request_type(db: Session, request_type_id: int):
        db_request_type = db.query(RequestType).filter(RequestType.id == request_type_id).first()
        if db_request_type:
            db.delete(db_request_type)
            db.commit()
        return db_request_type
