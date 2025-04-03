from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.medical_record import MedicalRecord
    from app.models.prescription import Prescription
    from app.models.request import Request
    from app.models.appointment import Appointment
    from app.models.nurse import Nurse
    from app.models.doctor_specialization import DoctorSpecialization

class Doctor(SQLModel, table=True):
    __tablename__ = 'doctor'

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=255)
    surname: str = Field(max_length=255)
    email: Optional[str] = Field(default=None, max_length=255)
    phone_number: Optional[str] = Field(default=None, max_length=20)

    specialization_id: Optional[int] = Field(default=None, foreign_key="doctor_specialization.id")

    medical_records: List["MedicalRecord"] = Relationship(back_populates="doctor")
    requests: List["Request"] = Relationship(back_populates="doctor")
    appointments: List["Appointment"] = Relationship(back_populates="doctor")
    prescriptions: List["Prescription"] = Relationship(back_populates="doctor")
    nurses: List["Nurse"] = Relationship(back_populates="doctor")
    doctor_specialization: Optional["DoctorSpecialization"] = Relationship(back_populates="doctors")
