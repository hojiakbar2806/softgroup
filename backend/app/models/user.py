from sqlalchemy import Boolean, Column, Integer, String, ForeignKey
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
    is_verified = Column(Boolean, default=False, nullable=False)

    templates = relationship("Template", back_populates="owner")
    ratings = relationship("Rating", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    liked_templates = relationship("UserLikes", back_populates="user")

    def set_password(self, password):
        self.hashed_password = hash_password(password)

    def check_password(self, password):
        return check_password(password, self.hashed_password)


class UserLikes(Base):
    __tablename__ = "user_likes"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    template_id = Column(Integer, ForeignKey("templates.id"), primary_key=True)

    user = relationship("User", back_populates="liked_templates")
    template = relationship("Template", back_populates="liked_by_users")
