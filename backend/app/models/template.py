from app.database.base import Base
from sqlalchemy.orm import validates, relationship
from sqlalchemy import Column, Integer, String, Boolean, Float, Text, ForeignKey


class Template(Base):
    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    current_price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    likes = Column(Integer, default=0, nullable=False)
    status = Column(String(50), default="IN_PROCESS", nullable=False)
    downloads = Column(Integer, default=0, nullable=False)
    views = Column(Integer, default=0, nullable=False)
    avarage_rating = Column(Float, default=0, nullable=False)

    owner_id = Column(Integer, ForeignKey("users.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))

    categories = relationship(
        "Category",
        back_populates="templates"
    )

    liked_by_users = relationship(
        "UserLikes",
        back_populates="template",
        cascade="all, delete"
    )

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
    reviews = relationship(
        "Review",
        back_populates="template"
    )


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=True)
    template_id = Column(Integer, ForeignKey("templates.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    template = relationship("Template", back_populates="reviews")
    user = relationship("User", back_populates="reviews")

    @validates("rating")
    def validate_rating(self, key, value):
        if value < 0 or value > 5:
            raise ValueError("Rating must be between 0 and 5")
        return value


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


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    templates = relationship(
        "Template",
        back_populates="categories",
        cascade="all, delete-orphan"
    )

    translations = relationship(
        "CategoryTranslation",
        back_populates="category",
        cascade="all, delete-orphan"
    )


class CategoryTranslation(Base):
    __tablename__ = "category_translations"

    id = Column(Integer, primary_key=True, index=True)
    language = Column(String(2), nullable=False)
    title = Column(String(255), nullable=False)

    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    category = relationship("Category", back_populates="translations")


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
