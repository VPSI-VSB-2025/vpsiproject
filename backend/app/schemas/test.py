from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class TestBase(BaseModel):
    test_date: datetime
    results: str = Field(max_length=512)
    state: str = Field(max_length=20)
    test_type_id: int
    request_id: int

class TestCreate(TestBase):
    pass

class TestUpdate(BaseModel):
    test_date: Optional[datetime] = None
    results: Optional[str] = Field(max_length=512, default=None)
    state: Optional[str] = Field(max_length=20, default=None)
    test_type_id: Optional[int] = None
    request_id: Optional[int] = None


class TestOut(TestBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True