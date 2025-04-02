from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class RequestTypeOut(BaseModel):
    typ_zadanky_id: Optional[int]
    popis: Optional[str]
    nazev: Optional[str]

class RequestOut(BaseModel):
    zadanka_id: int
    state: str
    created_at: datetime
    typ_zadanky: Optional[RequestTypeOut]

class TermOut(BaseModel):
    kalendar_id: int
    event_type: str
    date_from: datetime
    date_to: datetime
    registration_mandatory: bool
    zadanky: List[RequestOut]
