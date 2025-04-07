from pydantic import BaseModel, ConfigDict
from typing import Optional

class DoctorBase(BaseModel):
    name: str
    surname: str
    email: Optional[str] = None
    phone_number: Optional[str] = None
    specialization_id: Optional[int] = None

class DoctorCreate(DoctorBase):
    pass

class DoctorOut(DoctorBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
