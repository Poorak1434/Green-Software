import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "GreenSoftware ML Microservice"
    VERSION: str = "0.1.0"
    
    # Database connection for TimescaleDB
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://iot_admin:secure_iot_password_123@localhost:5432/iot_platform")
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
