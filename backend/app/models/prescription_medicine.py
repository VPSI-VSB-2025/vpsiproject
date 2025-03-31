from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.prescription import Prescription

class Medicine(SQLModel, table=True):
    __tablename__ = 'medicine'

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)

    prescriptions: List["Prescription"] = Relationship(back_populates="medicine")