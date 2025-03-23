from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

class Nurse(SQLModel, table=True):
    __tablename__ = 'nurse'

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(max_length=255)
    surname: str = Field(max_length=255)
    email: Optional[str] = Field(default=None, max_length=255)
    phone_number: Optional[str] = Field(default=None, max_length=20)

    doctor_id: Optional[int] = Field(default=None, foreign_key="doctor.id")
    
    doctor: "Doctor" = Relationship(back_populates="nurses")