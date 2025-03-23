from pydantic import BaseModel
from datetime import datetime

class MedicalRecordBase(BaseModel):
    type: str
    created_at: datetime
    patient_id: int
    doctor_id: int

class MedicalRecordCreate(MedicalRecordBase):
    patient_id: int
    doctor_id: int

class MedicalRecordOut(MedicalRecordBase):
    id: int

    class Config:
        orm_mode = True
