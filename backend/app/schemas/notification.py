from pydantic import BaseModel
from datetime import datetime


class NotificationBase(BaseModel):
    message: str
    opened: bool
    created_at: datetime

class NotificationCreate(NotificationBase):
    pass

class NotificationOut(NotificationBase):
    id: int
    patient_id: int | None = None
    doctor_id: int | None = None

    class Config:
        orm_mode = True
