from fastapi import File, Form, UploadFile
from pydantic import BaseModel
from typing import List, Optional


class TemplateCreate(BaseModel):
    title_uz: str
    title_ru: str
    title_en: str
    description_uz: str
    description_ru: str
    description_en: str
    current_price: float
    original_price: Optional[float]
    template_file: UploadFile
    images: List[UploadFile]

    @classmethod
    def as_form(
        cls,
        title_uz: str = Form(...),
        title_ru: str = Form(...),
        title_en: str = Form(...),
        description_uz: str = Form(...),
        description_ru: str = Form(...),
        description_en: str = Form(...),
        current_price: float = Form(...),
        original_price: Optional[float] = Form(None),
        template_file: UploadFile = File(...),
        images: List[UploadFile] = File(...),
    ):
        return cls(
            title_uz=title_uz,
            title_ru=title_ru,
            title_en=title_en,
            description_uz=description_uz,
            description_ru=description_ru,
            description_en=description_en,
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
