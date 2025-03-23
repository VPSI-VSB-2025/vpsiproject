from pydantic import BaseModel
from datetime import datetime

class RequestBase(BaseModel):
    state: str
    created_at: datetime

class RequestCreate(RequestBase):
    pass

class RequestOut(RequestBase):
    id: int

    class Config:
        orm_mode = True