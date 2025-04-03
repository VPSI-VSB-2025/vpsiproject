from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .patient import Patient

class Notification(SQLModel, table=True):
    __tablename__ = 'notification'

    id: Optional[int] = Field(default=None, primary_key=True)
    message: str = Field(max_length=255)
    opened: bool = Field(default=False)
    created_at: datetime = Field(default=datetime.now(timezone.utc))

    patient_id: Optional[int] = Field(default=None, foreign_key="patient.id")
    doctor_id: Optional[int] = Field(default=None, foreign_key="doctor.id")

    patient: Optional["Patient"] = Relationship(back_populates="notifications")