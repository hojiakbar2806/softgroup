from pydantic import BaseModel
from typing import List, Optional
from .image import Image


class Image(BaseModel):
    id: int
    url: str


class Feature(BaseModel):
    text: str
    available: bool = True


class Rating(BaseModel):
    id: int
    rating: float


class TemplateResponse(BaseModel):
    id: int
    slug: str
    title: str
    current_price: float
    original_price: Optional[float] = None
    description: str = None
    owner_id: int
    downloads: int
    avarage_rating: float
    likes: int
    views: int
    features: List[Feature]
    ratings: List[Rating]
    images: List[Image]
