from pydantic import BaseModel

class RequestType(BaseModel):
    name: str
    description: str

class RequestCreate(RequestType):
    pass

class RequestOut(RequestType):
    id: int

    class Config:
        orm_mode = True
