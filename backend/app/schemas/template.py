from pydantic import BaseModel
from typing import List, Optional
from .image import Image


class Image(BaseModel):
    id: int
    url: str


class TemplateBase(BaseModel):
    title: str
    current_price: float
    original_price: Optional[float] = None
    description: Optional[str] = None


class Feature(BaseModel):
    text: str
    available: bool = True


class TemplateResponse(BaseModel):
    id: int
    slug: str
    title: str
    current_price: float
    original_price: Optional[float] = None
    description: Optional[str] = None
    owner_id: int
    features: List[Feature]
    images: List[Image]
