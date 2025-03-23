from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.core.database import create_tables
from app.api.patients import router as patients_router
from app.api.doctors import router as doctors_router
from app.api.medical_records import router as medical_records_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up...")
    create_tables()
    yield
    print("Shutting down...")

app = FastAPI(lifespan=lifespan)

app.include_router(patients_router, prefix="/patients", tags=["Patients"])
app.include_router(doctors_router, prefix="/doctors", tags=["Doctors"])
app.include_router(medical_records_router, prefix="/medical_records", tags=["Medical Records"])


create_tables()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
