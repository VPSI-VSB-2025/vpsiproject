from pydantic import BaseModel
from typing import List, Optional
from app.schemas.request import RequestOut
from app.schemas.appointment import AppointmentOut
from app.schemas.test import TestOut

class PatientLookup(BaseModel):
    personal_number: str
    name: str
    surname: str

class PatientHistoryResponse(BaseModel):
    requests: List[RequestOut]
    appointments: List[AppointmentOut]
    tests: List[TestOut]
