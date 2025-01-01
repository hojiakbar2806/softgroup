import os
import json
import zipfile
from sqlalchemy.future import select
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import APIRouter, Depends, Form, HTTPException

from app.models.user import User
from app.core.config import settings

from app.utils.slug import unique_slug
from app.database.session import get_db_session
from app.schemas.template import TemplateCreate, TemplateResponse
from app.core.dependencies import current_auth_user, get_accept_language
from app.models.template import Feature, FeatureTranslation, Image, Template, TemplateTranslation

router = APIRouter()


@router.post("/create")
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

    slug = await unique_slug(template.title_en, session)

    current_template = os.path.join(settings.TEMPLATES_DIR, slug)
    images_dir = os.path.join(current_template, "images")

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
        owner_id=current_user.id
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


@router.get("/all", response_model=list[TemplateResponse])
async def read_templates(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db_session)
):
    query = select(Template).offset(skip).limit(limit)
    query = query.options(
        selectinload(Template.translations),
        selectinload(Template.images),
        selectinload(Template.features).selectinload(Feature.translations),
        selectinload(Template.ratings)
    )

    result = await db.execute(query)
    templates = result.scalars().all()
    return templates


@ router.get("/search")
async def search_templates(
    query: str,
    language: str = Depends(get_accept_language),
    session: AsyncSession = Depends(get_db_session)
):
    stmt = select(Template).join(Template.translations).filter(
        TemplateTranslation.language == language,
        TemplateTranslation.title.contains(query)
    ).options(
        selectinload(Template.translations),
        selectinload(Template.images),
        selectinload(Template.features).selectinload(Feature.translations),
        selectinload(Template.ratings)
    )

    result = await session.execute(stmt)
    return result.scalars().all()


@ router.get("/{slug}")
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
