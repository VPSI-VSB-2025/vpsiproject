from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

class Doctor(SQLModel, table=True):
    __tablename__ = 'doctor'

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(max_length=255)
    surname: str = Field(max_length=255)
    email: Optional[str] = Field(default=None, max_length=255)
    phone_number: Optional[str] = Field(default=None, max_length=20)
    specialization: int 

    medical_records: List["MedicalRecord"] = Relationship(back_populates="doctor")
    requests: List["Request"] = Relationship(back_populates="doctor")
    calendar: List["Calendar"] = Relationship(back_populates="doctor")
    prescriptions: List["Prescription"] = Relationship(back_populates="doctor")
    nurses: List["Nurse"] = Relationship(back_populates="doctor")