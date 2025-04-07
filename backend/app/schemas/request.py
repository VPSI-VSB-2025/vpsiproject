from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class RequestBase(BaseModel):
    state: str
    description: Optional[str] = None
    patient_id: int
    doctor_id: int
    appointment_id: int
    request_type_id: Optional[int] = None

class RequestCreate(RequestBase):
    pass

class RequestOut(RequestBase):
    id: int

    class Config:
        orm_mode = True
