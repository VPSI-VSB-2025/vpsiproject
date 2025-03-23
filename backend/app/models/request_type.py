from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.request import Request

class RequestType(SQLModel, table=True):
    __tablename__ = 'request_type'

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=100)
    description: str = Field(max_length = 255)
    length: int

    requests: List["Request"] = Relationship(back_populates="request_type")
