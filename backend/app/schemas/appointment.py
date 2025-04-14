from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# Forward references if needed
# from .request import RequestOut # Example

class AppointmentBase(BaseModel):
    event_type: str
    date_from: datetime
    date_to: datetime
    registration_mandatory: bool = True
    doctor_id: Optional[int] = None

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(BaseModel):
    event_type: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    registration_mandatory: Optional[bool] = None
    doctor_id: Optional[int] = None


class AppointmentOut(AppointmentBase):
    id: int
    created_at: datetime
    # Potentially include related data if needed
    # requests: List[RequestOut] = [] # Adjust based on actual RequestOut schema

    class Config:
        from_attributes = True # Changed from orm_mode
