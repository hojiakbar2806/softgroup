
from typing import List, Optional
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import Depends, HTTPException, status
from pydantic import BaseModel

class Review(BaseModel):
    id: int
    rating: float
    comment: str
    is_liked: bool
    user_id: int

    class Config:
        from_attributes = True

class Rating(BaseModel):
    id: int
    rating: float

    class Config:
        from_attributes = True

class Image(BaseModel):
    id: int
    url: str

    class Config:
        from_attributes = True

class FeatureTranslation(BaseModel):
    text: str
    language: str

    class Config:
        from_attributes = True

class Feature(BaseModel):
    id: int
    available: bool
    translations: List[FeatureTranslation]

    class Config:
        from_attributes = True

class TemplateTranslation(BaseModel):
    title: str
    language: str
    description: Optional[str]

    class Config:
        from_attributes = True

class TemplateResponse(BaseModel):
    id: int
    slug: str
    current_price: float
    original_price: Optional[float] = None
    downloads: int
    average_rating: float
    likes: int
    is_liked: bool = False
    views: int
    ratings: List[Rating]
    images: List[Image]
    translations: List[TemplateTranslation]
    features: List[Feature]
    reviews: List[Review]

    class Config:
        from_attributes = True

class PaginatedTemplateResponse(BaseModel):
    data: List[TemplateResponse]
    current_page: int
    per_page: int
    total_pages: int
    total_templates: int
    has_next: bool
    has_previous: bool