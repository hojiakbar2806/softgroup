import json
import os
from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from app.database.session import get_db_session
from app.models import Category, CategoryTranslation
from app.core.config import settings
import slugify

from app.schemas.category import CategoryResponse, CategoryUpdate


router = APIRouter(prefix="/categories")


@router.post("")
async def category_create(
    image: UploadFile = File(...),
    translations: str = Form(
        ..., description='[{"language": "uz", "title": "title"}, {"language": "ru", "title": "title"}, {"language": "en", "title": "title"}]'),
    db: AsyncSession = Depends(get_db_session)
):
    translations = json.loads(translations)

    title_en = next((t["title"]
                    for t in translations if t["language"] == "en"), None)
    if not title_en:
        raise HTTPException(
            status_code=400, detail="English translation is required for the category title")

    slug = slugify.slugify(title_en)

    image_path = os.path.join(settings.DOCS_DIR, "images", "categories")
    os.makedirs(image_path, exist_ok=True)

    existing_category = await db.execute(
        select(Category).where(Category.slug == slug)
    )
    if existing_category.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Category already exists")

    file_ext = os.path.splitext(image.filename)[1]
    filename = f"{slug}{file_ext}"
    with open(os.path.join(image_path, filename), "wb") as buffer:
        buffer.write(await image.read())

    category = Category(
        image_url=os.path.join(image_path, filename),
        slug=slug
    )
    db.add(category)

    await db.flush()

    for translation in translations:
        category_translation = CategoryTranslation(
            title=translation["title"],
            language=translation["language"],
            category_id=category.id
        )
        db.add(category_translation)

    await db.commit()
    await db.refresh(category)

    return JSONResponse(status_code=201, content={"message": "Category created successfully"})


@router.get("", response_model=List[CategoryResponse])
async def read_categories(db: AsyncSession = Depends(get_db_session)):
    query = select(Category).order_by(Category.id).options(
        selectinload(Category.translations)
    )
    result = await db.execute(query)
    categories = result.scalars().all()
    return categories


@router.get("/{slug}", response_model=CategoryResponse)
async def read_category_by_id(slug: str, db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(
        select(Category)
        .where(Category.slug == slug)
        .options(selectinload(Category.translations))
    )
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.delete("/{category_id}")
async def delete_category(
    category_id: int,
    db: AsyncSession = Depends(get_db_session)
):
    result = await db.execute(select(Category).where(Category.id == category_id))
    existing_category = result.scalar_one_or_none()
    if not existing_category:
        raise HTTPException(status_code=404, detail="Category not found")

    await db.delete(existing_category)
    await db.commit()
    return {"detail": "Category deleted successfully"}
