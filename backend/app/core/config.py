from pathlib import Path
from pydantic_settings import BaseSettings


CURRENT = Path(__file__).resolve()
CORE_DIR = CURRENT.parent
APP_DIR = CORE_DIR.parent
PROJECT_DIR = APP_DIR.parent


class Settings(BaseSettings):
    DEBUG: bool = False
    APP_ENV: str = "development"

    APP_DIR: Path = APP_DIR
    PROJECT_DIR: Path = PROJECT_DIR
    DOCS_DIR: Path = PROJECT_DIR / "docs"
    TEMPLATES_DIR: Path = PROJECT_DIR / DOCS_DIR / "templates"
    IMAGES_DIR: Path = PROJECT_DIR / DOCS_DIR / "static" / "images"

    TEMPLATE_IMAGES_DIR: Path = IMAGES_DIR / "template"
    DOC_IMAGES_DIR: Path = IMAGES_DIR / "document"

    ALLOWED_IMAGE_TYPES: list = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    ALLOWED_TEMPLATE_TYPES: list = ['.zip', '.pdf', '.doc', '.docx']

    BOT_TOKEN: str = "7958951230:AAEuOYFSGTHB27TsNG_3n6c8uol3i2FdzUQ"
    CHAT_IDS: list = [1960543012, 5050150433, 5738468941]
    BASE_URL: str = "https://api.softgroup.uz"
    WEBHOOK_URL: str = "https://api.softgroup.uz"

    URL: str = "sqlite+aiosqlite:///softgroup.db"

    ALGORITHM: str = "RS256"
    PRIVATE_KEY_PATH: Path = CORE_DIR / "certs" / "jwt-private.pem"
    PUBLIC_KEY_PATH: Path = CORE_DIR / "certs" / "jwt-public.pem"
    ACCESS_TOKEN_EXPIRES_MINUTES: float = (24*60)
    REFRESH_TOKEN_EXPIRES_MINUTES: float = (7*24*60)
    ACTIVATION_TOKEN_EXPIRES_MINUTS: int = 2

    SECRET_KEY: str = "f56bd6bc8efed7bad12675f761e69f36ff8f403cc471da0028b8ea6cd95bfbe9"


settings = Settings()
