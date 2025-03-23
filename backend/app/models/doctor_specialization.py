from sqlmodel import SQLModel, Field

class DoctorSpecialization(SQLModel, table=True):
    __tablename__ = 'doctor_specialization'

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(max_length=255)
