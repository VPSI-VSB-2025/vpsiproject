from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class PatientBase(BaseModel):
    name: str
    surname: str
    email: str
    date_of_birth: date
    sex: str = Field(..., max_length=1, description="Single character: 'M' for male, 'F' for female, 'O' for other")
    address: str
    phone_number: Optional[str] = None
    personal_number: str

class PatientCreate(PatientBase):
    pass

class PatientOut(BaseModel):
    id: int
    name: str
    surname: str
    date_of_birth: date
    sex: str
    address: str
    phone_number: Optional[str] = None
    personal_number: str

    class Config:
        orm_mode = True
