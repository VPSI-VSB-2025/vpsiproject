from pydantic import BaseModel
from datetime import datetime

class CalendarBase(BaseModel):
    event_type: str
    date_from: datetime
    date_to: datetime
    state: str
    created_at: datetime

class CalendarCreate(CalendarBase):
    pass

class CalendarOut(CalendarBase):
    id: int

    class Config:
        orm_mode = True
