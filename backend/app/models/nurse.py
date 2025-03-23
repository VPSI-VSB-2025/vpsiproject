from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.doctor import Doctor
    from app.models.request import Request

class Nurse(SQLModel, table=True):
    __tablename__ = 'nurse'

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(max_length=255)
    surname: str = Field(max_length=255)
    email: Optional[str] = Field(default=None, max_length=255)
    phone_number: Optional[str] = Field(default=None, max_length=20)

    doctor_id: Optional[int] = Field(default=None, foreign_key="doctor.id")

    doctor: "Doctor" = Relationship(back_populates="nurses")
    # Add the requests relationship
    requests: List["Request"] = Relationship(back_populates="nurse")
