from pydantic import BaseModel
from datetime import datetime

class AppoitmentBase(BaseModel):
    event_type: str
    date_from: datetime
    date_to: datetime
    registration_mandatory: bool
    created_at: datetime

class AppotmentCreate(AppoitmentBase):
    pass

class AppotmentOut(AppoitmentBase):
    id: int

    class Config:
        orm_mode = True
