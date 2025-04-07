from pydantic import BaseModel
from datetime import datetime

class AppointmentBase(BaseModel):
    event_type: str
    date_from: datetime
    date_to: datetime
    registration_mandatory: bool
    created_at: datetime
    doctor_id: int

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentOut(AppointmentBase):
    id: int

    class Config:
        orm_mode = True
