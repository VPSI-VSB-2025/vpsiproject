from sqlmodel import Session, select
from typing import List
# Correct the model import
from app.models.test_type import MedicalTestType
# Import the create schema
from app.schemas.test_type import TestTypeCreate

class TestTypeService:

    @staticmethod
    def get_all_test_types(db: Session, skip: int = 0, limit: int = 100) -> List[MedicalTestType]:
        """Retrieve all test types with pagination."""
        # Use the correct model name and db.execute
        statement = select(MedicalTestType).offset(skip).limit(limit)
        test_types = db.execute(statement).scalars().all()
        return test_types

    @staticmethod
    def get_test_type_by_id(db: Session, test_type_id: int) -> MedicalTestType | None:
        """Retrieves a test type record by its ID."""
        # Use the correct model name and db.execute
        statement = select(MedicalTestType).where(MedicalTestType.id == test_type_id)
        test_type = db.execute(statement).scalar_one_or_none()
        return test_type

    @staticmethod
    def create_test_type(db: Session, test_type_data: TestTypeCreate) -> MedicalTestType:
        """Creates a new test type record in the database."""
        db_test_type = MedicalTestType.model_validate(test_type_data)
        db.add(db_test_type)
        db.commit()
        db.refresh(db_test_type)
        return db_test_type

# Add other methods like update, delete if needed later
