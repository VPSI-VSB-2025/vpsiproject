from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.database import create_tables
from app.api.patients import router as patients_router
from app.api.doctors import router as doctors_router
from app.api.medical_records import router as medical_records_router
from app.api.doctor_specializations import router as doctor_specializations_router
from app.api.nurses import router as nurses_router
from app.api.list_all_terms import router as all_terms_router
from app.api.appointments import router as appointments_router
from app.api.requests import router as requests_router
from app.api.test_types import router as test_types_router
from app.api.history import router as history_router
from app.api.tests import router as tests_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up...")
    create_tables()
    yield
    print("Shutting down...")

app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://nemocnice.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(patients_router, prefix="/patients", tags=["Patients"])
app.include_router(doctors_router, prefix="/doctors", tags=["Doctors"])
app.include_router(medical_records_router, prefix="/medical_records", tags=["Medical Records"])
app.include_router(doctor_specializations_router, prefix="/specializations", tags=["Doctor Specializations"])
app.include_router(nurses_router, prefix="/nurses", tags=["Nurses"])
app.include_router(all_terms_router, prefix="/api/terms", tags=["Terms"])
app.include_router(appointments_router, prefix="/appointments", tags=["Appointments"])
app.include_router(requests_router, prefix="/requests", tags=["requests"])
app.include_router(test_types_router, prefix="/test-types", tags=["test-types"])
app.include_router(history_router, prefix="/history", tags=["History"])
app.include_router(tests_router, prefix="/tests", tags=["Tests"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
