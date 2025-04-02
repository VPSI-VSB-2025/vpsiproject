from pydantic import BaseModel
from datetime import datetime

class AppoitmentBase(BaseModel):
    change_type: str
    description: str
    created_at: datetime

class AppotmentCreate(AppoitmentBase):
    pass

class AppotmentOut(AppoitmentBase):
    id: int

    class Config:
        orm_mode = True
