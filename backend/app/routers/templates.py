import os
import json
import zipfile

from slugify import slugify
from typing import List, Optional

from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.core.dependencies import current_auth_user
from app.database.session import get_db_session
from app.models.template import Feature, Image,  Template
from app.models.user import User
from app.schemas.template import TemplateResponse
from app.core.config import settings

router = APIRouter()

title: str
current_price: float
original_price: Optional[float] = None
description: Optional[str] = None


@router.post("/")
async def create_template(
    title: str = Form(...),
    current_price: float = Form(...),
    original_price: Optional[float] = Form(None),
    description: str = Form(...),
    features: str = Form(...),
    template_file: UploadFile = File(...),
    images: List[UploadFile] = File(...),
    session: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(current_auth_user)
):

    features_list = json.loads(features)

    slug = slugify(title)
    template_folder = os.path.join(settings.TEMPLATE_DIR, slug)
    images_folder = os.path.join(template_folder, "images")

    os.makedirs(template_folder, exist_ok=True)
    os.makedirs(images_folder, exist_ok=True)

    with zipfile.ZipFile(template_file.file, "r") as zip_ref:
        zip_ref.extractall(template_folder)

    db_template = Template(
        title=title,
        current_price=current_price,
        original_price=original_price,
        description=description,
        slug=slug,
        owner_id=current_user.id
    )
    session.add(db_template)
    await session.commit()
    await session.refresh(db_template)

    feature_objects = []
    for feature in features_list:
        db_feature = Feature(
            text=feature['text'],
            available=feature['available'],
            template_id=db_template.id
        )
        feature_objects.append(db_feature)
    session.add_all(feature_objects)

    image_objects = []
    for index, image in enumerate(images):
        file_extension = os.path.splitext(image.filename)[1]
        unique_filename = f"{index}_{slugify(title)}{file_extension}"
        file_path = os.path.join(images_folder, unique_filename)

        # Save image to file system
        content = await image.read()
        with open(file_path, "wb") as f:
            f.write(content)

        # Add the image record to the database
        relative_path = os.path.relpath(file_path, settings.TEMPLATE_DIR)
        db_image = Image(
            url=relative_path,
            template_id=db_template.id
        )
        image_objects.append(db_image)

    session.add_all(image_objects)
    await session.commit()
    await session.refresh(db_template)

    return db_template


@router.get("/", response_model=list[TemplateResponse])
async def read_templates(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db_session)):
    query = select(Template)\
        .options(selectinload(Template.images), selectinload(Template.features))\
        .offset(skip).limit(limit)
    result = await db.execute(query)
    templates = result.scalars().all()

    return templates


@router.get("/{slug}", response_model=TemplateResponse)
async def read_template(slug: str, session: AsyncSession = Depends(get_db_session)):
    query = select(Template).filter(Template.slug == slug)\
        .options(
            selectinload(Template.images),
            selectinload(Template.features)
    )
    result = await session.execute(query)
    template = result.scalar_one_or_none()
    if template is None:
        raise HTTPException(status_code=404, detail="Template not found")
    return template
