from pydantic import BaseModel

class RelationBase(BaseModel):
    relation: str

class RelationCreate(RelationBase):
    pass

class RelationOut(RelationBase):
    patient_id: int
    related_id: int

    class Config:
        orm_mode = True