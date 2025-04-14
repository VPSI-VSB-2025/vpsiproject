from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class RequestBase(BaseModel):
    state: str = "pending"
    description: Optional[str] = None
    patient_id: int
    doctor_id: int
    nurse_id: Optional[int] = None
    appointment_id: Optional[int] = None
    request_type_id: Optional[int] = None

class RequestCreate(RequestBase):
    pass

class RequestUpdate(BaseModel):
    state: Optional[str] = None
    description: Optional[str] = None
    nurse_id: Optional[int] = None
    appointment_id: Optional[int] = None
    request_type_id: Optional[int] = None


class RequestOut(RequestBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
