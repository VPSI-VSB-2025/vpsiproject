from pydantic import BaseModel
from datetime import datetime

class BookTermRequest(BaseModel):
    kalendar_id: int
    doktor_id: int
    pacient_jmeno: str
    pacient_prijmeni: str
    pacient_telefon: str
    pacient_rodne_cislo: str
    pacient_poznamka: str
    type_zadanky_id: int
    state: str
    created_at: datetime