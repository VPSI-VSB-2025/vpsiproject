from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.patient import Patient


class FamilyRelation(SQLModel, table=True):
    __tablename__ = 'family_relation'

    patient_id: int = Field(foreign_key="patient.id", primary_key=True)
    related_id: int = Field(foreign_key="patient.id", primary_key=True)
    relation: str = Field(max_length=50)

    #patient: "Patient" = Relationship(back_populates="relations_as_patient")
    #related: "Patient" = Relationship(back_populates="relations_as_related")