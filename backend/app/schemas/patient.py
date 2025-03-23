from pydantic import BaseModel
from datetime import date
from typing import Optional

class PatientBase(BaseModel):
    date_of_birth: date
    sex: str
    address: str
    phone_number: Optional[str] = None
    birth_number: str

class PatientCreate(PatientBase):
    pass

class PatientOut(BaseModel):
    id: int

    class Config:
        orm_mode = True
