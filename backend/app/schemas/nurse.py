from pydantic import BaseModel
from typing import Optional

class NurseBase(BaseModel):
    name: str
    surname: str
    email: Optional[str] = None
    phone_number: Optional[str] = None
    
class NurseCreate(NurseBase):
    pass

class NurseOut(NurseBase):
    id: int

    class Config:
        orm_mode = True
