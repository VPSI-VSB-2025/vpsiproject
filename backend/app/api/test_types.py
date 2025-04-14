from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List

from app.dependencies import get_db
from app.models.test_type import MedicalTestType
# Import both TestTypeOut and TestTypeCreate schemas
from app.schemas.test_type import TestTypeOut, TestTypeCreate
from app.services.test_type_service import TestTypeService

router = APIRouter()

# Add the POST endpoint for creating test types
@router.post("/", response_model=TestTypeOut, status_code=status.HTTP_201_CREATED)
async def create_test_type(test_type: TestTypeCreate, db: Session = Depends(get_db)):
    """Endpoint to create a new test type."""
    db_test_type = TestTypeService.create_test_type(db=db, test_type_data=test_type)
    return db_test_type


@router.get("/", response_model=List[TestTypeOut])
def read_test_types_endpoint(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """Endpoint to retrieve a list of test types."""
    test_types = TestTypeService.get_all_test_types(db=db, skip=skip, limit=limit)
    return test_types


@router.get("/{test_type_id}", response_model=TestTypeOut)
def read_test_type_endpoint(
    test_type_id: int,
    db: Session = Depends(get_db),
):
    """Endpoint to retrieve a specific test type by ID."""
    db_test_type = TestTypeService.get_test_type_by_id(db=db, test_type_id=test_type_id)
    if db_test_type is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Test Type not found")
    return db_test_type
