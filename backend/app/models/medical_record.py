from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.patient import Patient
    from app.models.doctor import Doctor

class MedicalRecord(SQLModel, table=True):
    __tablename__ = 'medical_record'

    id: Optional[int] = Field(default=None, primary_key=True)
    type: str = Field(max_length=255)
    created_at: datetime = Field(default=datetime.now(timezone.utc))

    patient_id: int = Field(foreign_key="patient.id")
    doctor_id: int = Field(foreign_key="doctor.id")

    patient: "Patient" = Relationship(back_populates="medical_records")
    doctor: "Doctor" = Relationship(back_populates="medical_records")