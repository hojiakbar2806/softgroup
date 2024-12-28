from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database.base import Base
from app.core.security.hashing import check_password, hash_password


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(200), nullable=False)
    phone_number = Column(String(20), unique=True, nullable=False)

    templates = relationship("Template", back_populates="owner")

    def set_password(self, password):
        self.hashed_password = hash_password(password)

    def check_password(self, password):
        return check_password(password, self.hashed_password)
