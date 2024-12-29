import os
import json
import zipfile

from fastapi.responses import FileResponse, JSONResponse
from fastapi import status
from fastapi.templating import Jinja2Templates
from slugify import slugify
from typing import List, Optional

from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile

from app.core.dependencies import current_auth_user
from app.database.session import get_db_session
from app.models.template import Feature, Image, Rating,  Template
from app.models.user import User
from app.schemas.template import TemplateResponse
from app.core.config import settings

router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.post("/create")
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

    temp_dir = os.path.join(settings.TEMPLATE_DIR, slug)
    images_dir = os.path.join(temp_dir, "images")

    os.makedirs(temp_dir, exist_ok=True)
    os.makedirs(images_dir, exist_ok=True)

    zip_file_path = os.path.join(temp_dir, f"{slug}.zip")

    with open(zip_file_path, "wb") as buffer:
        content = await template_file.read()
        buffer.write(content)

    with zipfile.ZipFile(template_file.file, "r") as zip_ref:
        zip_ref.extractall(temp_dir)

    zip_folder = os.path.join(
        temp_dir, template_file.filename.replace(".zip", ""))

    if os.path.exists(zip_folder):
        for f in os.listdir(zip_folder):
            FROM = os.path.join(zip_folder, f)
            TO = os.path.join(temp_dir, f)
            os.rename(FROM, TO)
        os.rmdir(zip_folder)

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
        image_filename = f"{slugify(title)}_{index}{file_extension}"
        file_path = os.path.join(images_dir, image_filename)

        with open(file_path, "wb") as buffer:
            content = await image.read()
            buffer.write(content)

        relative_path = os.path.relpath(file_path)

        db_image = Image(
            url=relative_path,
            template_id=db_template.id
        )
        image_objects.append(db_image)

    session.add_all(image_objects)
    await session.commit()
    await session.refresh(db_template)

    return db_template


@router.get("/all", response_model=list[TemplateResponse])
async def read_templates(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db_session)):
    query = select(Template).options(
        selectinload(Template.images),
        selectinload(Template.features),
        selectinload(Template.ratings)
    ).offset(skip).limit(limit)
    result = await db.execute(query)
    templates = result.scalars().all()

    return templates


@router.get("/search", response_model=list[TemplateResponse])
async def search_templates(query: str, session: AsyncSession = Depends(get_db_session)):
    query = select(Template).where(Template.title.contains(query)).options(
        selectinload(Template.images),
        selectinload(Template.features),
        selectinload(Template.ratings)
    )
    result = await session.execute(query)
    templates = result.scalars().all()

    return templates


@router.patch("/add/rating/{slug}")
async def add_rating(
        slug: str,
        rating: int,
        session: AsyncSession = Depends(get_db_session),
        current_user: User = Depends(current_auth_user)
):
    query = select(Template).where(Template.slug == slug)
    result = await session.execute(query)
    template = result.scalar_one_or_none()
    if template is None:
        raise HTTPException(status_code=404, detail="Template not found")

    query = select(Rating).where(
        Rating.template_id == template.id,
        Rating.user_id == current_user.id
    )
    result = await session.execute(query)
    existing_rating = result.scalar_one_or_none()

    if existing_rating:
        raise HTTPException(
            status_code=400,
            detail="You have already rated this template"
        )

    query = select(Rating).where(Rating.template_id == template.id)
    result = await session.execute(query)
    ratings = result.scalars().all()

    if len(ratings) == 0:
        avarage_rating = rating
    else:
        total_rating = sum(rating.rating for rating in ratings)
        avarage_rating = total_rating / len(ratings)

    new_rating = Rating(
        template_id=template.id,
        user_id=current_user.id,
        rating=rating
    )
    session.add(new_rating)

    template.avarage_rating = avarage_rating

    await session.commit()
    await session.refresh(template)

    return JSONResponse(
        content={"message": "Rating added successfully"},
        status_code=status.HTTP_201_CREATED
    )


@router.get("/{slug}", response_model=TemplateResponse)
async def read_template(slug: str, session: AsyncSession = Depends(get_db_session)):
    query = select(Template).filter(Template.slug == slug).options(
        selectinload(Template.images),
        selectinload(Template.features),
        selectinload(Template.ratings)
    )
    result = await session.execute(query)
    template = result.scalar_one_or_none()
    if template is None:
        raise HTTPException(status_code=404, detail="Template not found")
    template.views += 1
    return template


@router.get("/download/{slug}")
async def download_file(slug: str, session: AsyncSession = Depends(get_db_session)):
    query = select(Template).where(Template.slug == slug)
    result = await session.execute(query)
    template = result.scalar_one_or_none()
    if template is None:
        raise HTTPException(status_code=404, detail="Template not found")

    template.downloads += 1
    await session.commit()
    await session.refresh(template)

    tem_dir = os.path.join(settings.TEMPLATE_DIR, slug)
    file_path = os.path.join(tem_dir, f"{slug}.zip")
    print(file_path)

    if os.path.exists(file_path):
        return FileResponse(file_path, media_type='application/zip', filename=f"{slug}.zip")
    else:
        return {"error": "File not found"}
