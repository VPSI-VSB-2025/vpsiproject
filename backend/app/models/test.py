from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone

class Test(SQLModel, table=True):
    id: int | None = Field(primary_key=True)
    test_date: datetime
    results: str = Field(max_length=512)
    created_at: datetime = Field(default=datetime.now(timezone.utc))
    state: str = Field(max_length=20)

    test_type_id: int = Field(foreign_key="test_type.id")
    request_id: int = Field(foreign_key="request.id")

    test_type: "TestType" = Relationship(back_populates="tests")
    request: "Request" = Relationship(back_populates="tests")

    