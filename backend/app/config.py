import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    FLASK_ENV = os.getenv("FLASK_ENV", "production")
    DEBUG = os.getenv("DEBUG", "False") == "True"
    RUN_ON_POSTGRES = os.getenv("RUN_ON_POSTGRES", "False") == "True"

    if RUN_ON_POSTGRES:
        DB_USER = os.getenv("POSTGRES_USER")
        DB_PASS = os.getenv("POSTGRES_PASSWORD")
        DB_HOST = os.getenv("POSTGRES_HOST")
        DB_PORT = os.getenv("POSTGRES_PORT")
        DB_NAME = os.getenv("POSTGRES_DB")

        SQLALCHEMY_DATABASE_URI = f"postgresql+psycopg2://{
            DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    else:
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.getenv("POSTGRES_DB")}.db"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
