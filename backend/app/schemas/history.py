# filepath: c:\Users\roryb\Desktop\vpsiproject\backend\app\schemas\history.py
from pydantic import BaseModel
from typing import List, Optional
from app.schemas.request import RequestOut # Assuming RequestOut exists and is suitable
from app.schemas.appointment import AppointmentOut # Assuming AppointmentOut exists
from app.schemas.test import TestOut # Assuming TestOut exists

class PatientLookup(BaseModel):
    personal_number: str
    name: str
    surname: str
    # phone: str # Phone is not in the Patient model currently, skipping for now

class PatientHistoryResponse(BaseModel):
    requests: List[RequestOut]
    appointments: List[AppointmentOut]
    tests: List[TestOut]
