from pydantic import BaseModel
from datetime import datetime

class TestBase(BaseModel):
    test_date: datetime
    results: str
    created_at: datetime
    state: str

class TestCreate(TestBase):
    pass

class TestOut(TestBase):
    id: int

    class Config:
        orm_mode = True