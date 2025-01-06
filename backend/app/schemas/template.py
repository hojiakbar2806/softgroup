from fastapi import File, Form, UploadFile
from pydantic import BaseModel
from typing import List, Optional


class TemplateCreate(BaseModel):
    title: str
    description: str
    current_price: float
    category_slug: str
    original_price: Optional[float]
    template_file: UploadFile
    images: List[UploadFile]

    @classmethod
    def as_form(
        cls,
        title: str = Form(...),
        category_slug: str = Form(...),
        description: str = Form(...),
        current_price: float = Form(...),
        original_price: Optional[float] = Form(None),
        template_file: UploadFile = File(...),
        images: List[UploadFile] = File(...),
    ):
        return cls(
            title=title,
            category_slug=category_slug,
            description=description,
            current_price=current_price,
            original_price=original_price,
            template_file=template_file,
            images=images,
        )


class Rating(BaseModel):
    id: int
    rating: float


class Image(BaseModel):
    id: int
    url: str


class FeatureTranslation(BaseModel):
    text: str
    language: str


class Feature(BaseModel):
    id: int
    available: bool
    translations: List[FeatureTranslation]


class TemplateTranslation(BaseModel):
    title: str
    language: str
    description: Optional[str]


class TemplateResponse(BaseModel):
    id: int
    slug: str
    current_price: float
    original_price: Optional[float] = None
    downloads: int
    avarage_rating: float
    likes: int
    views: int
    ratings: List[Rating]
    images: List[Image]
    translations: List[TemplateTranslation]
    features: List[Feature]


class PaginatedTemplateResponse(BaseModel):
    data: List[TemplateResponse]
    current_page: int
    per_page: int
    total_pages: int
    total_templates: int
    has_next: bool
    has_previous: bool
