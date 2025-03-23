from sqlmodel import SQLModel
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from app.models import * 

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

# SQLModel.metadata.create_all(engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    SQLModel.metadata.create_all(bind=engine)
    print("Tables created")