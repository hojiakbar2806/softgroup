from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
CORE = Path(__file__).resolve().parent


class Settings(BaseSettings):
    DEBUG: bool = False
    APP_ENV: str = "development"
    TEMPLATE_DIR: str = "templates"

    POSTGRES_DB: str
    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    SQL_DB_URL: str

    @property
    def URL(self) -> str:
        if self.APP_ENV == "production":
            return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        else:
            return f"sqlite+aiosqlite:///{str(BASE_DIR/self.SQL_DB_URL)}"

    ALGORITHM: str = "RS256"
    PRIVATE_KEY_PATH: Path = CORE / "certs" / "jwt-private.pem"
    PUBLIC_KEY_PATH: Path = CORE / "certs" / "jwt-public.pem"
    ACCESS_TOKEN_EXPIRES_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRES_MINUTES: int = (60*10)
    ACTIVATION_TOKEN_EXPIRES_MINUTS: int = 2

    SECRET_KEY: str = "f56bd6bc8efed7bad12675f761e69f36ff8f403cc471da0028b8ea6cd95bfbe9"


settings = Settings()
