from pydantic import BaseModel, ConfigDict

class DoctorSpecializationBase(BaseModel):
    name: str

class DoctorSpecializationCreate(DoctorSpecializationBase):
    pass

class DoctorSpecializationOut(DoctorSpecializationBase):
    id: int
    model_config = ConfigDict(from_attributes=True)