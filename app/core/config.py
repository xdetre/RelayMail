from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    DOMAIN: str
    RESEND_API_KEY: str
    TURNSTILE_SECRET_KEY: str


    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str = "http://localhost:8001/auth/google/callback"

    class Config:
        env_file = ".env"

settings = Settings()