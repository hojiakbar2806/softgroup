from sqlalchemy import Column, Integer, String, Boolean, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base


class Template(Base):
    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    current_price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    downloads = Column(Integer, default=0, nullable=False)
    likes = Column(Integer, default=0, nullable=False)
    views = Column(Integer, default=0, nullable=False)
    avarage_rating = Column(Float, default=0, nullable=False)

    owner_id = Column(Integer, ForeignKey("users.id"))

    translations = relationship(
        "TemplateTranslation",
        back_populates="template",
        cascade="all, delete-orphan"
    )
    owner = relationship(
        "User",
        back_populates="templates"
    )
    features = relationship(
        "Feature",
        back_populates="template",
        cascade="all, delete-orphan"
    )
    images = relationship(
        "Image",
        back_populates="template",
        cascade="all, delete-orphan"
    )
    ratings = relationship(
        "Rating",
        back_populates="template"
    )


class TemplateTranslation(Base):
    __tablename__ = "template_translations"

    id = Column(Integer, primary_key=True, index=True)
    language = Column(String(2), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    template_id = Column(Integer, ForeignKey("templates.id"), nullable=False)

    template = relationship(
        "Template",
        back_populates="translations"
    )


class Feature(Base):
    __tablename__ = "features"

    id = Column(Integer, primary_key=True, index=True)
    available = Column(Boolean, nullable=False, default=True)

    template_id = Column(Integer, ForeignKey("templates.id"), nullable=False)

    translations = relationship(
        "FeatureTranslation",
        back_populates="feature",
        cascade="all, delete-orphan"
    )
    template = relationship(
        "Template", back_populates="features"
    )


class FeatureTranslation(Base):
    __tablename__ = "feature_translations"

    id = Column(Integer, primary_key=True, index=True)
    language = Column(String(2), nullable=False)
    text = Column(String(255), nullable=False)
    feature_id = Column(Integer, ForeignKey("features.id"), nullable=False)

    feature = relationship(
        "Feature", back_populates="translations"
    )


class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(255), nullable=False)
    template_id = Column(Integer, ForeignKey("templates.id"), nullable=False)

    template = relationship("Template", back_populates="images")


class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(Integer, ForeignKey("templates.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Float, nullable=False)

    template = relationship("Template", back_populates="ratings")
    user = relationship("User", back_populates="ratings")
