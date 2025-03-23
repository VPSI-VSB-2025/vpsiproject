from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING, List

if TYPE_CHECKING:
    from app.models.patient import Patient
    from app.models.doctor import Doctor
    from app.models.request_type import RequestType
    from app.models.calendar import Calendar
    from app.models.nurse import Nurse
    from app.models.test import Test 

class Request(SQLModel, table=True):
    __tablename__ = 'request'

    id: Optional[int] = Field(default=None, primary_key=True)
    state: str = Field(default="pending", max_length=50)
    created_at: datetime = Field(default=datetime.now(timezone.utc))

    patient_id: int = Field(foreign_key="patient.id")
    doctor_id: int = Field(foreign_key="doctor.id")
    nurse_id: int = Field(foreign_key="nurse.id")
    calendar_id: Optional[int] = Field(foreign_key="calendar.id")
    request_type_id: int = Field(foreign_key="request_type.id")

    patient: "Patient" = Relationship(back_populates="requests")
    doctor: "Doctor" = Relationship(back_populates="requests")
    nurse: "Nurse" = Relationship(back_populates="requests")
    request_type: "RequestType" = Relationship(back_populates="requests")
    calendar_event: "Calendar" = Relationship(back_populates="requests")
    tests: List["Test"] = Relationship(back_populates="request")
