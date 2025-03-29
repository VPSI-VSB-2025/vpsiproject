from sqlmodel import SQLModel, Field, Relationship
from datetime import date
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.medical_record import MedicalRecord
    from app.models.prescription import Prescription
    from app.models.request import Request
    from app.models.relation import FamilyRelation
    from app.models.appointment_history import AppointmentHistory
    from app.models.notification import Notification

class Patient(SQLModel, table=True):
    __tablename__ = 'patient'

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=255)
    surname: str = Field(max_length=255)
    email: Optional[str] = Field(default=None, max_length=255)
    date_of_birth: Optional[date] = Field(default=None, description="Date of birth in DD-MM-YYYY format")
    sex: Optional[str] = Field(default=None, max_length=1, description="Single character: 'M' for male, 'F' for female, 'O' for other")
    address: Optional[str] = Field(default=None, max_length=255)
    phone_number: Optional[str] = Field(default=None, max_length=20)
    personal_number: str = Field(min_length=10, max_length=10)

    medical_records: List["MedicalRecord"] = Relationship(back_populates="patient")
    prescriptions: List["Prescription"] = Relationship(back_populates="patient")
    relations: List["FamilyRelation"] = Relationship(back_populates="patient")
    requests: List["Request"] = Relationship(back_populates="patient")
    appointments_history: List["AppointmentHistory"] = Relationship(back_populates="patient")
    notifications: List["Notification"] = Relationship(back_populates="patient")