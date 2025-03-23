from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os
from pathlib import Path

# Load .env file
dotenv_path = Path(__file__).parents[2] / '.env'
load_dotenv(dotenv_path=dotenv_path)

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


settings = Settings()