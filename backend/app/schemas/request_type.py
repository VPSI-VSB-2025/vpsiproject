from pydantic import BaseModel

class RequestTypeBase(BaseModel):
    name: str
    description: str
    length: int

class RequestTypeCreate(RequestTypeBase):
    pass

class RequestTypeOut(RequestTypeBase):
    id: int

    class Config:
        orm_mode = True