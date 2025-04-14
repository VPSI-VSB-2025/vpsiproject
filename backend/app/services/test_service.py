from sqlmodel import Session, select
from fastapi import HTTPException, status
from app.models.test import Test
from app.schemas.test import TestCreate, TestUpdate


class TestService:    
    @staticmethod
    def create_test(db: Session, test_data: TestCreate) -> Test:
        """Creates a new test record in the database."""
        print(f"Received test data: {test_data}")  # Added print
        # Create a dictionary from test_data and add id=None explicitly
        test_dict = test_data.model_dump()
        test_dict["id"] = None  # Set id to None explicitly
        db_test = Test.model_validate(test_dict)
        print(f"Validated test model: {db_test}") # Added print
        db.add(db_test)
        db.commit()
        db.refresh(db_test)
        print(f"Test after commit and refresh: {db_test}") # Added print
        return db_test

    @staticmethod
    def get_test_by_id(db: Session, test_id: int) -> Test | None:
        """Retrieves a test record by its ID."""
        statement = select(Test).where(Test.id == test_id)
        test = db.execute(statement).scalar_one_or_none() # Reverted to db.execute().scalar_one_or_none()
        if not test:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Test not found")
        return test

    @staticmethod
    def get_all_tests(db: Session, skip: int = 0, limit: int = 100) -> list[Test]:
        """Retrieve all tests with pagination."""
        statement = select(Test).offset(skip).limit(limit)
        tests = db.execute(statement).scalars().all() # Reverted to db.execute().scalars().all()
        return tests

    @staticmethod
    def update_test(db: Session, test_id: int, test_update_data: TestUpdate) -> Test:
        """Updates an existing test record."""
        db_test = TestService.get_test_by_id(db, test_id)  # Reuse get_test_by_id to handle not found case
        # get_test_by_id already raises HTTPException if not found, so no need to check here again.

        update_data = test_update_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_test, key, value)

        db.add(db_test)
        db.commit()
        db.refresh(db_test)
        return db_test

    @staticmethod
    def delete_test(db: Session, test_id: int) -> Test:
        """Deletes a test record by its ID."""
        db_test = TestService.get_test_by_id(db, test_id)  # Reuse get_test_by_id to handle not found case
        # get_test_by_id already raises HTTPException if not found, so no need to check here again.

        db.delete(db_test)
        db.commit()
        return db_test  # Or return {"message": "Test deleted successfully"}

