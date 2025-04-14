from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List

from app.dependencies import get_db
from app.models.test import Test
from app.schemas.test import TestCreate, TestOut, TestUpdate
from app.services.test_service import TestService
# Assuming authentication dependencies are defined elsewhere, e.g., app.dependencies
# from app.dependencies import get_current_active_doctor # Example dependency

router = APIRouter()

@router.post("/", response_model=TestOut, status_code=status.HTTP_201_CREATED)
def create_test_endpoint(
    test_data: TestCreate,
    db: Session = Depends(get_db),
    # current_doctor: Doctor = Depends(get_current_active_doctor) # Add auth if needed
):
    """Endpoint to create a new test result."""
    # Use TestService class
    return TestService.create_test(db=db, test_data=test_data)

@router.get("/{test_id}", response_model=TestOut)
def read_test_endpoint(
    test_id: int,
    db: Session = Depends(get_db),
    # Add auth dependencies if needed, e.g., get_current_user
):
    """Endpoint to retrieve a specific test result by ID."""
    # Use TestService class
    db_test = TestService.get_test_by_id(db=db, test_id=test_id)
    if db_test is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Test not found")
    # Add authorization checks if necessary, e.g., ensure user can view this test
    return db_test

@router.get("/", response_model=List[TestOut])
def read_tests_endpoint(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    # Add auth dependencies if needed
):
    """Endpoint to retrieve a list of test results."""
    # Use TestService class
    tests = TestService.get_all_tests(db=db, skip=skip, limit=limit)
    # Add filtering/authorization based on user role if needed
    return tests

@router.put("/{test_id}", response_model=TestOut)
def update_test_endpoint(
    test_id: int,
    test_update_data: TestUpdate,
    db: Session = Depends(get_db),
    # current_doctor: Doctor = Depends(get_current_active_doctor) # Add auth if needed
):
    """Endpoint to update an existing test result."""
    # Use TestService class
    updated_test = TestService.update_test(db=db, test_id=test_id, test_update_data=test_update_data)
    if updated_test is None:  # Should be handled by service, but double-check
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Test not found")
    return updated_test

@router.delete("/{test_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_test_endpoint(
    test_id: int,
    db: Session = Depends(get_db),
    # current_doctor: Doctor = Depends(get_current_active_doctor) # Add auth if needed
):
    """Endpoint to delete a test result."""
    # Use TestService class
    TestService.delete_test(db=db, test_id=test_id)
    return  # Return None with 204 status code
