from sqlalchemy import Column, Integer, String, Boolean, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base


class Template(Base):
    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    current_price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    rating = Column(Float, default=0.0, nullable=False)
    rating_count = Column(Integer, default=0, nullable=False)
    description = Column(Text, nullable=True)
    downloads = Column(Integer, default=0, nullable=False)
    likes = Column(Integer, default=0, nullable=False)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="templates")

    features = relationship(
        "Feature", back_populates="template", cascade="all, delete-orphan")
    images = relationship("Image", back_populates="template",
                          cascade="all, delete-orphan")


class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(255), nullable=False)
    template_id = Column(Integer, ForeignKey("templates.id"), nullable=False)

    template = relationship("Template", back_populates="images")


class Feature(Base):
    __tablename__ = "features"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String(255), nullable=False)
    available = Column(Boolean, nullable=False, default=True)
    template_id = Column(Integer, ForeignKey("templates.id"), nullable=False)

    template = relationship("Template", back_populates="features")
