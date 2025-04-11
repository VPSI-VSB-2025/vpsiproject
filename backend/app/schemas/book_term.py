from pydantic import BaseModel, Field


class BookTermBase(BaseModel):
    appointment_id: int = Field(..., alias="kalendar_id")
    doctor_id: int = Field(..., alias="doktor_id")
    name: str = Field(..., alias="pacient_jmeno")
    surname: str = Field(..., alias="pacient_prijmeni")
    phone_number: str = Field(..., alias="pacient_telefon")
    personal_number: str = Field(..., alias="pacient_rodne_cislo")
    description: str = Field(..., alias="pacient_poznamka")
    request_type_id: int = Field(..., alias="typ_zadanky_id")

class BookTermOut(BaseModel):
    message: str
