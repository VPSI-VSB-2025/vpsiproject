from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.request import Request
    from app.models.doctor import Doctor

class Appointment(SQLModel, table=True):
    __tablename__ = 'appointment'

    id: Optional[int] = Field(default=None, primary_key=True)
    event_type: str = Field(max_length=255)
    date_from: datetime
    date_to: datetime
    registration_mandatory: bool = Field(default=True)
    created_at: datetime = Field(default=datetime.now(timezone.utc))

    doctor_id: Optional[int] = Field(default=None, foreign_key="doctor.id")

    requests: list["Request"] = Relationship(back_populates="appointments")
    doctor: Optional["Doctor"] = Relationship(back_populates="appointments")
