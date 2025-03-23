from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import PrimaryKeyConstraint
from typing import Optional


class FamilyRelation(SQLModel, table=True):
    __tablename__ = 'family_relation'
    id: Optional[int] = Field(default=None, primary_key=True)
    # patient_id: int = Field(foreign_key="patient.id")
    # related_id: int = Field(foreign_key="patient.id")

    relation: str = Field(max_length=50)

    #  __table_args__ = (
    ##      PrimaryKeyConstraint('patient_id', 'related_id'),
    # )
    
    #  patient: "Patient" = Relationship(back_populates="family_relations")