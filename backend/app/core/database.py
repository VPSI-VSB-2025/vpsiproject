from sqlmodel import SQLModel
from sqlalchemy import create_engine
from models import *

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SQLModel.metadata.create_all(engine)

def create_tables():
    SQLModel.metadata.create_all(bind=engine)
    print("Tables created")