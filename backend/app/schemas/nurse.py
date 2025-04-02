from pydantic import BaseModel, ConfigDict
from typing import Optional

class NurseBase(BaseModel):
    name: str
    surname: str
    email: Optional[str] = None
    phone_number: Optional[str] = None

class NurseCreate(NurseBase):
    doctor_id: Optional[int] = None

class NurseOut(NurseBase):
    id: int
    doctor_id: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)
