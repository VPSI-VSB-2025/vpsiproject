from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from typing import Optional

class Calendar(SQLModel, table=True):
    __tablename__ = 'calendar'

    id: int | None = Field(default=None, primary_key=True)
    event_type: str = Field(max_length=255)
    date_from: datetime
    date_to: datetime
    state: str = Field(max_length=50, default="pending")
    created_at: datetime = Field(default=datetime.now(timezone.utc))

    request_id: Optional[int] = Field(default=None, foreign_key="request.id")
    doctor_id: Optional[int] = Field(default=None, foreign_key="doctor.id")

    doctor: "Doctor" = Relationship(back_populates="calendar")
    equest: "Request" = Relationship(back_populates="calendar_event")