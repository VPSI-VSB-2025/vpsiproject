from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# Forward references for relationships if needed, adjust imports as necessary
# from .appointment import AppointmentOut # Example if needed
# from .test import TestOut # Example if needed

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
    # Potentially include related data if needed for the history endpoint
    # appointments: Optional[AppointmentOut] = None # Adjust based on actual AppointmentOut schema
    # tests: List[TestOut] = [] # Adjust based on actual TestOut schema

    class Config:
        from_attributes = True # Changed from orm_mode
