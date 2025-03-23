from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.test import Test

class TestType(SQLModel, table=True):
    __tablename__ = 'test_type'

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = Field(default=None, max_length=255)

    tests: List["Test"] = Relationship(back_populates="test_type")