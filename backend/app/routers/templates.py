import os
import json
import zipfile

from sqlalchemy import func
from typing import List, Optional
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.responses import FileResponse, JSONResponse
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.models.user import User
from app.core.config import settings
from app.utils.slug import unique_slug
from app.database.session import get_db_session
from app.utils.translator import translate_text
from app.core.dependencies import current_auth_user
from app.schemas.template import PaginatedTemplateResponse
from app.bot.send_file_to_telegram import send_file_to_telegram
from app.models.template import Category, Feature, FeatureTranslation, Image, Template, TemplateTranslation

router = APIRouter(prefix="/templates")


@router.post("")
async def create_template(
    title: str = Form(...),
    category_slug: str = Form(...),
    description: str = Form(...),
    current_price: float = Form(...),
    original_price: Optional[float] = Form(None),
    template_file: UploadFile = File(...),
    images: List[UploadFile] = File(...),
    features: str = Form(
        ...,
        description='[{"text": "text", "available": true}]'
    ),
    session: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(current_auth_user),
):
    features = json.loads(features)

    query = select(Category).where(Category.slug == category_slug)
    result = await session.execute(query)
    category = result.scalar_one_or_none()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    slug = await unique_slug(title, session)
    images_dir = os.path.join("docs", "static", "images", "templates", slug)
    os.makedirs(images_dir, exist_ok=True)

    if template_file.filename.endswith(".zip"):
        current_template = os.path.join("docs", "templates", slug)

        os.makedirs(current_template, exist_ok=True)

        zip_file_path = os.path.join(current_template, f"{slug}.zip")

        with open(zip_file_path, "wb") as buffer:
            buffer.write(await template_file.read())

        try:
            with zipfile.ZipFile(template_file.file, "r") as zip_ref:
                zip_ref.extractall(current_template)
                filename = zip_ref.namelist()[0]
        except zipfile.BadZipFile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid zip file format"
            )

        current_zipfile_path = os.path.join(current_template, filename)

        for f in os.listdir(current_zipfile_path):
            os.rename(
                os.path.join(current_zipfile_path, f),
                os.path.join(current_template, f)
            )
        os.rmdir(current_zipfile_path)

    else:
        slug = f"{slug}.{template_file.filename.split('.')[-1]}"
        current_docs = os.path.join("docs", slug)

        with open(current_docs, "wb") as buffer:
            buffer.write(await template_file.read())

    db_template = Template(
        slug=slug,
        current_price=current_price,
        original_price=original_price,
        owner_id=current_user.id,
        category_id=category.id
    )
    session.add(db_template)
    await session.flush()

    translate_texts = await translate_text(title)

    if translate_texts is None:
        title_uz = title
        title_ru = title
        title_en = title
    else:
        title_uz, title_ru, title_en = translate_texts

    translate_texts = await translate_text(description)

    if translate_texts is None:
        description_uz = description
        description_ru = description
        description_en = description
    else:
        description_uz, description_ru, description_en = translate_texts

    translations = [
        TemplateTranslation(
            language="uz",
            title=title_uz,
            description=description_uz,
            template_id=db_template.id
        ),
        TemplateTranslation(
            language="ru",
            title=title_ru,
            description=description_ru,
            template_id=db_template.id
        ),
        TemplateTranslation(
            language="en",
            title=title_en,
            description=description_en,
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
        translate_texts = await translate_text(feature['text'])

        if translate_texts is None:
            text_uz = feature['text']
            text_ru = feature['text']
            text_en = feature['text']
        else:
            text_uz, text_ru, text_en = translate_texts

        feature_translations = [
            FeatureTranslation(
                language="uz",
                text=text_uz,
                feature_id=db_feature.id
            ),
            FeatureTranslation(
                language="ru",
                text=text_ru,
                feature_id=db_feature.id
            ),
            FeatureTranslation(
                language="en",
                text=text_en,
                feature_id=db_feature.id
            )
        ]
        session.add_all(feature_translations)

    for index, image in enumerate(images):
        try:
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
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to process image {index}"
            )

    await session.commit()
    await send_file_to_telegram(slug)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"message": "Template created successfully"}
    )


@router.get("", response_model=PaginatedTemplateResponse)
async def read_templates(
    page: int = 1,
    per_page: int = 10,
    slug: Optional[str] = None,
    category: Optional[str] = None,
    tier: Optional[str] = None,
    db: AsyncSession = Depends(get_db_session),
):
    try:
        query = select(Template).where(Template.is_verified == True)

        if slug:
            query = query.where(Template.slug.contains(slug))

        if category:
            c_query = select(Category).where(Category.slug == category)
            c_result = await db.execute(c_query)
            db_category = c_result.scalar_one_or_none()
            if not db_category:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Category not found"
                )

            query = query.where(Template.category_id == db_category.id)

        if tier == "premium":
            query = query.where(Template.current_price > 0)
        else:
            query = query.where(Template.current_price == 0)

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
            total_query = total_query.where(
                Template.category_id == db_category.id
            )

        total_result = await db.execute(total_query)
        templates_count = total_result.scalar()

        skip = (page - 1) * per_page
        query = query.offset(skip).limit(per_page)

        result = await db.execute(query)
        templates = result.scalars().all()

        total_pages = (templates_count + per_page - 1) // per_page

        return {
            "data": templates,
            "current_page": page,
            "per_page": per_page,
            "total_pages": total_pages,
            "total_templates": templates_count,
            "has_next": page < total_pages,
            "has_previous": page > 1,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.get("/{slug}")
async def read_template(
    slug: str,
    session: AsyncSession = Depends(get_db_session)
):
    try:
        query = select(Template).where(Template.slug == slug).options(
            selectinload(Template.translations),
            selectinload(Template.images),
            selectinload(Template.features).selectinload(Feature.translations),
            selectinload(Template.ratings)
        )
        result = await session.execute(query)
        template = result.scalar_one_or_none()

        if template is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Template not found"
            )
        return template

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch template"
        )


@router.get("/download/{slug}")
async def download_template(
    slug: str,
    session: AsyncSession = Depends(get_db_session)
):
    query = select(Template).where(Template.slug == slug)
    result = await session.execute(query)
    template = result.scalar_one_or_none()

    if template is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )

    if len(slug.split(".")) == 1:
        file_path = os.path.join("docs", "templates", slug, f"{slug}.zip")

        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Template file not found"
            )
        response = FileResponse(
            file_path,
            media_type='application/zip',
            filename=f"{slug}.zip"
        )
    else:
        file_path = os.path.join("docs", slug)

        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Template file not found"
            )
        response = FileResponse(
            file_path,
            media_type=f"application/{slug.split('.')[1]}",
            filename=slug
        )
    template.downloads += 1
    await session.commit()

    return response


@router.get("/{slug}/{path:path}", response_class=FileResponse)
async def get_template_file(slug: str, path: str, session: AsyncSession = Depends(get_db_session)):
    query = select(Template).where(Template.slug == slug)
    result = await session.execute(query)
    template = result.scalar_one_or_none()

    if template is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )

    current_template = os.path.join(settings.DOCS_DIR, "templates", slug)

    if not os.path.exists(current_template):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )

    file_path = os.path.join(current_template, path)

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    return FileResponse(file_path)
