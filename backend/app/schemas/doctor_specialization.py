from pydantic import BaseModel

class DoctorSpecializationBase(BaseModel):
    name: str

class DoctorSpecializationCreate(DoctorSpecializationBase):
    pass

class DoctorSpecializationOut(DoctorSpecializationBase):
    id: int

    class Config:
        orm_mode = True