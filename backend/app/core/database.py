from sqlmodel import SQLModel
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from app.models import * 
from app.core.config import settings
import os

# Use the DATABASE_URL from settings, with a fallback to SQLite
DATABASE_URL = settings.DATABASE_URL or "sqlite:///./test.db"

# For PostgreSQL from Neon.tech, we need to ensure SSL mode is enabled
connect_args = {}
if DATABASE_URL.startswith("postgresql"):
    connect_args = {"sslmode": "require"}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    SQLModel.metadata.create_all(bind=engine)
    print(f"Tables created using {DATABASE_URL}")