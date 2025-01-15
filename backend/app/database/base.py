from datetime import datetime
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, DateTime


class Base(DeclarativeBase):
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow)
