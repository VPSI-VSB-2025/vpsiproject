from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime, timezone

if TYPE_CHECKING:
    from app.models.patient import Patient
    from app.models.doctor import Doctor
    from app.models.prescription_medicine import Medicine


class Prescription(SQLModel, table=True):
    __tablename__ = 'prescription'

    id: Optional[int] = Field(default=None, primary_key=True)
    dosage: str = Field(max_length=255)
    date_from: Optional[datetime]
    date_to: Optional[datetime]
    created_at: datetime = Field(default=datetime.now(timezone.utc))

    patient_id: int = Field(foreign_key="patient.id")
    doctor_id: int = Field(foreign_key="doctor.id")
    medicine_id: int = Field(foreign_key="medicine.id")

    patient: "Patient" = Relationship(back_populates="prescriptions")
    doctor: "Doctor" = Relationship(back_populates="prescriptions")
    medicine: List["Medicine"] = Relationship(back_populates="prescriptions")
    