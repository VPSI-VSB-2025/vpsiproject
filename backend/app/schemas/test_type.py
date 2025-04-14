from sqlmodel import SQLModel
from typing import Optional

# Schema for reading test type data (output)
class TestTypeOut(SQLModel):
    id: int
    name: str
    description: Optional[str] = None

# Schema for creating a test type
class TestTypeCreate(SQLModel):
    name: str
    description: Optional[str] = None

