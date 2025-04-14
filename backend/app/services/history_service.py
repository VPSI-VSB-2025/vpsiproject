from sqlmodel import select # Keep select from sqlmodel for statement building
from sqlalchemy.orm import joinedload, Session as SQLAlchemySession # Import standard Session for type hinting if needed
from fastapi import HTTPException, status

from app.models.patient import Patient
from app.models.request import Request
from app.models.appointment import Appointment
from app.models.test import Test
from app.schemas.history import PatientLookup, PatientHistoryResponse

# Type hint db as SQLAlchemySession for clarity if get_db provides that
def get_patient_history(db: SQLAlchemySession, lookup_data: PatientLookup) -> PatientHistoryResponse:
    """Fetches requests, appointments, and tests for a patient based on lookup data."""

    # Find the patient first
    statement = select(Patient).where(
        Patient.personal_number == lookup_data.personal_number,
        Patient.name == lookup_data.name,
        Patient.surname == lookup_data.surname
    )
    # Use db.scalars().first() for a single result or db.execute().scalar_one_or_none()
    patient = db.scalars(statement).first() # Changed from db.exec().first()

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found with the provided details."
        )

    # Fetch requests associated with the patient, preloading related data
    request_statement = (
        select(Request)
        .where(Request.patient_id == patient.id)
        .options(
            joinedload(Request.appointments), # Load related appointments
            joinedload(Request.tests)         # Load related tests
        )
    )
    # Use db.scalars().unique().all() for multiple results when using joinedload on collections
    patient_requests = db.scalars(request_statement).unique().all() # Added .unique()

    # Extract appointments and tests from the fetched requests
    patient_appointments = []
    patient_tests = []
    for req in patient_requests:
        if req.appointments:
            # Assuming one appointment per request based on current model (Request.appointments is a relationship, not list)
            # If it were a list, you'd use patient_appointments.extend(req.appointments)
            patient_appointments.append(req.appointments)
        if req.tests:
            patient_tests.extend(req.tests)

    # Remove duplicates just in case (though relationships should handle this)
    # Note: This relies on the models having proper __hash__ and __eq__ or being unique by ID
    unique_appointments = list({appt.id: appt for appt in patient_appointments}.values())
    unique_tests = list({test.id: test for test in patient_tests}.values())

    return PatientHistoryResponse(
        requests=patient_requests,
        appointments=unique_appointments,
        tests=unique_tests
    )
