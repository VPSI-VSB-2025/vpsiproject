from sqlmodel import select
from sqlalchemy.orm import joinedload, Session as SQLAlchemySession
from fastapi import HTTPException, status

from app.models.patient import Patient
from app.models.request import Request
from app.schemas.history import PatientLookup, PatientHistoryResponse

def get_patient_history(db: SQLAlchemySession, lookup_data: PatientLookup) -> PatientHistoryResponse:
    """Fetches requests, appointments, and tests for a patient based on lookup data."""

    statement = select(Patient).where(
        Patient.personal_number == lookup_data.personal_number,
        Patient.name == lookup_data.name,
        Patient.surname == lookup_data.surname
    )
    patient = db.scalars(statement).first()

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found with the provided details."
        )

    request_statement = (
        select(Request)
        .where(Request.patient_id == patient.id)
        .options(
            joinedload(Request.appointments),
            joinedload(Request.tests)
        )
    )
    patient_requests = db.scalars(request_statement).unique().all()

    patient_appointments = []
    patient_tests = []
    for req in patient_requests:
        if req.appointments:
            patient_appointments.append(req.appointments)
        if req.tests:
            patient_tests.extend(req.tests)

    unique_appointments = list({appt.id: appt for appt in patient_appointments}.values())
    unique_tests = list({test.id: test for test in patient_tests}.values())

    return PatientHistoryResponse(
        requests=patient_requests,
        appointments=unique_appointments,
        tests=unique_tests
    )
