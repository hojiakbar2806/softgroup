from typing import List, Optional
from pydantic import BaseModel


class Translation(BaseModel):
    language: str
    title: str


class CategoryBase(BaseModel):
    category_image: Optional[str]
    translations: Optional[List[Translation]]


class CategoryCreate(CategoryBase):
    category_image: Optional[str]
    translations: Optional[List[Translation]]


class CategoryUpdate(CategoryBase):
    pass


class CategoryResponse(BaseModel):
    id: int
    image_url: str
    slug: str
    translations: List[Translation]
