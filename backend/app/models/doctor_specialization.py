from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING, List

if TYPE_CHECKING:
    from app.models.doctor import Doctor

class DoctorSpecialization(SQLModel, table=True):
    __tablename__ = 'doctor_specialization'

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=255)

    doctors: List["Doctor"] = Relationship(back_populates="specialization")