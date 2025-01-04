import os
import json
from typing import Optional
import zipfile
from sqlalchemy import Select, func
from sqlalchemy.future import select
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import APIRouter, Depends, Form, HTTPException

from app.models.user import User
from app.core.config import settings

from app.utils.slug import unique_slug
from app.database.session import get_db_session
from app.schemas.template import TemplateCreate, PaginatedTemplateResponse
from app.core.dependencies import current_auth_user
from app.models.template import Category, Feature, FeatureTranslation, Image, Template, TemplateTranslation

router = APIRouter()


@router.post("")
async def create_template(
    template: TemplateCreate = Depends(TemplateCreate.as_form),
    features: str = Form(
        ..., description='[{"text_uz": "text", "text_ru": "text", "text_en": "text", "available": true}]'),
    session: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(current_auth_user),

):
    try:
        features = json.loads(features)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid features")

    if not template.template_file:
        raise HTTPException(
            status_code=400, detail="Template file is required")

    query = select(Category).where(Category.slug == template.category_slug)
    result = await session.execute(query)
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    slug = await unique_slug(template.title_en, session)

    current_template = os.path.join(settings.DOCS_DIR, "templates", slug)
    images_dir = os.path.join(settings.DOCS_DIR, "images")

    os.makedirs(current_template, exist_ok=True)
    os.makedirs(images_dir, exist_ok=True)

    zip_file_path = os.path.join(current_template, f"{slug}.zip")
    with open(zip_file_path, "wb") as buffer:
        buffer.write(await template.template_file.read())

    with zipfile.ZipFile(template.template_file.file, "r") as zip_ref:
        zip_ref.extractall(current_template)
        filename = zip_ref.namelist()[0]

    current_zipfile_path = os.path.join(current_template, filename)
    if not os.path.exists(current_zipfile_path):
        raise HTTPException(status_code=400, detail="Invalid zip file")

    for f in os.listdir(current_zipfile_path):
        os.rename(
            os.path.join(current_zipfile_path, f),
            os.path.join(current_template, f)
        )
    os.rmdir(current_zipfile_path)

    db_template = Template(
        slug=slug,
        current_price=template.current_price,
        original_price=template.original_price,
        owner_id=current_user.id,
        category_id=category.id
    )
    session.add(db_template)
    await session.flush()

    translations = [
        TemplateTranslation(
            language="uz",
            title=template.title_uz,
            description=template.description_uz,
            template_id=db_template.id
        ),
        TemplateTranslation(
            language="ru",
            title=template.title_ru,
            description=template.description_ru,
            template_id=db_template.id
        ),
        TemplateTranslation(
            language="en",
            title=template.title_en,
            description=template.description_en,
            template_id=db_template.id
        )
    ]
    session.add_all(translations)

    for feature in features:
        db_feature = Feature(
            available=feature['available'],
            template_id=db_template.id
        )
        session.add(db_feature)
        await session.flush()

        feature_translations = [
            FeatureTranslation(
                language="uz",
                text=feature['text_uz'],
                feature_id=db_feature.id
            ),
            FeatureTranslation(
                language="ru",
                text=feature['text_ru'],
                feature_id=db_feature.id
            ),
            FeatureTranslation(
                language="en",
                text=feature['text_en'],
                feature_id=db_feature.id
            )
        ]
        session.add_all(feature_translations)

    for index, image in enumerate(template.images):
        file_extension = os.path.splitext(image.filename)[1]
        image_filename = f"{slug}_{index}{file_extension}"
        file_path = os.path.join(images_dir, image_filename)

        with open(file_path, "wb") as buffer:
            buffer.write(await image.read())

        db_image = Image(
            url=os.path.relpath(file_path),
            template_id=db_template.id
        )
        session.add(db_image)

    await session.commit()
    await session.refresh(db_template)
    return JSONResponse(
        status_code=201,
        content={"message": "Template created successfully"}
    )


@router.get("", response_model=PaginatedTemplateResponse)
async def read_templates(
    page: int = 1,
    per_page: int = 10,
    slug: Optional[str] = None,
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db_session),
):
    query = select(Template)

    if slug:
        query = query.where(Template.slug.contains(slug))

    if category:
        c_query = select(Category).where(Category.slug == category)
        c_result = await db.execute(c_query)
        db_category = c_result.scalar_one_or_none()
        if not db_category:
            raise HTTPException(status_code=404, detail="Category not found")

        query = query.where(Template.category_id == db_category.id)

    query = query.options(
        selectinload(Template.translations),
        selectinload(Template.images),
        selectinload(Template.features).selectinload(Feature.translations),
        selectinload(Template.ratings),
    )

    total_query = select(func.count(Template.id))
    if slug:
        total_query = total_query.where(Template.slug.contains(slug))
    if category:
        total_query = total_query.where(Template.category_id == category)

    total_result = await db.execute(total_query)
    templates_count = total_result.scalar()

    skip = (page - 1) * per_page
    query = query.offset(skip).limit(per_page)

    result = await db.execute(query)
    templates = result.scalars().all()

    total_pages = (templates_count + per_page - 1) // per_page
    has_next = page < total_pages
    has_previous = page > 1

    return {
        "data": templates,
        "current_page": page,
        "per_page": per_page,
        "total_pages": total_pages,
        "total_templates": templates_count,
        "has_next": has_next,
        "has_previous": has_previous,
    }


@router.get("/{slug}")
async def read_template(
    slug: str,
    session: AsyncSession = Depends(get_db_session)
):
    query = select(Template).where(Template.slug == slug).options(
        selectinload(Template.translations),
        selectinload(Template.images),
        selectinload(Template.features).selectinload(Feature.translations),
        selectinload(Template.ratings)
    )
    result = await session.execute(query)
    template = result.scalar_one_or_none()

    if template is None:
        raise HTTPException(status_code=404, detail="Template not found")
    return template


@router.get("/download/{slug}")
async def download_template(
    slug: str,
    session: AsyncSession = Depends(get_db_session)
):
    query = select(Template).where(Template.slug == slug)
    result = await session.execute(query)
    template = result.scalar_one_or_none()

    if template is None:
        raise HTTPException(status_code=404, detail="Template not found")

    zip_file_path = os.path.join(settings.DOCS_DIR, slug, f"{slug}.zip")
    template.downloads += 1

    return FileResponse(zip_file_path)
