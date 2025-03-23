from sqlmodel import SQLModel, Field, Relationship
from datetime import date
from typing import Optional, List

class Patient(SQLModel, table=True):
    __tablename__ = 'patient'

    id: Optional[int] = Field(default=None, primary_key=True)
    date_of_birth: date
    sex: str = Field(max_length=1)
    address: str = Field(max_length=255)
    phone_number: Optional[str] = Field(default=None, max_length=20)
    personal_number: str = Field(min_length=10, max_length=10)

    medical_records: List["MedicalRecord"] = Relationship(back_populates="patient")
    prescriptions: List["Prescription"] = Relationship(back_populates="patient")
   # relations = List["FamilyRelation"] = Relationship(back_populates="patient")
    requests: List["Request"] = Relationship(back_populates="patient")
    