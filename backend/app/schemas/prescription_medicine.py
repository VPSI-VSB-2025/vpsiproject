from pydantic import BaseModel
from typing import Optional

class PrescriptionMedicineBase(BaseModel):
    name: str
    description: Optional[str] = None

class PrescriptionMedicineCreate(PrescriptionMedicineBase):
    pass

class PrescriptionMedicineOut(PrescriptionMedicineBase):
    id: int

    class Config:
        orm_mode = True
