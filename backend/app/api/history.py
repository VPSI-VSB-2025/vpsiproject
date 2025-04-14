from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
import logging

# Correct the import path for get_db
from app.dependencies import get_db
from app.schemas.history import PatientLookup, PatientHistoryResponse
from app.services import history_service

# Get a logger instance
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/patient", response_model=PatientHistoryResponse)
def get_patient_history_endpoint(
    lookup_data: PatientLookup,
    db: Session = Depends(get_db) # Use the correct dependency
):
    """Endpoint to retrieve a patient's history (requests, appointments, tests) based on lookup data."""
    try:
        history = history_service.get_patient_history(db=db, lookup_data=lookup_data)
        return history
    except HTTPException as e:
        # Re-raise HTTPExceptions (like 404 Not Found from the service)
        raise e
    except Exception as e:
        # Log the full exception traceback
        logger.exception("An unexpected error occurred while fetching patient history.")
        # Return a generic 500 error with a detail message
        raise HTTPException(status_code=500, detail="An internal server error occurred.")
