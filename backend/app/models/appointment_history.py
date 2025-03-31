from sqlmodel import SQLModel, Field
from datetime import datetime, timezone
from typing import Optional

class AppointmentHistory(SQLModel, table=True):
    __tablename__ = 'appointment_history'

    id: Optional[int] = Field(default=None, primary_key=True)
    change_type: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)
    created_at: datetime = Field(default=datetime.now(timezone.utc))

    appointment_id: Optional[int] = Field(default=None, foreign_key="appointment.id")
    doctor_id: Optional[int] = Field(default=None, foreign_key="doctor.id")
    pacient_id: Optional[int] = Field(default=None, foreign_key="patient.id")
    nurse_id: Optional[int] = Field(default=None, foreign_key="nurse.id")