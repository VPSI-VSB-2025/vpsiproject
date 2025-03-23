from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PrescriptionBase(BaseModel):
    dosage: str
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] =  None
    created_at: datetime
    
class PrescriptionCreate(PrescriptionBase):
    pass

class PrescriptionOut(PrescriptionBase):
    id: int

    class Config:
        orm_mode = True