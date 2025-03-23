from pydantic import BaseModel
from datetime import datetime

class MedicalRecordBase(BaseModel):
    type: str
    created_at: datetime

class MedicalRecordCreate(MedicalRecordBase):
    pass

class MedicalRecordOut(MedicalRecordBase):
    id: int

    class Config:
        orm_mode = True

    