import json
import shutil

from pathlib import Path
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
from app.utils.save_image import save_image_file
from app.utils.translate import handle_translations
from app.core.dependencies import current_auth_user
from app.utils.save_template import save_template_file
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
    features: str = Form(...,
                         description='[{"text": "text", "available": true}]'),
    session: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(current_auth_user),
):
    template_dir = None
    images_dir = None

    try:

        category = await session.scalar(
            select(Category).where(Category.slug == category_slug)
        )
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        slug = await unique_slug(title, session)
        slug, template_dir, images_dir = await save_template_file(template_file, slug)

        db_template = Template(
            slug=slug,
            current_price=current_price,
            original_price=original_price,
            owner_id=current_user.id,
            category_id=category.id
        )
        session.add(db_template)
        await session.flush()

        title_uz, title_ru, title_en = await handle_translations(title)
        desc_uz, desc_ru, desc_en = await handle_translations(description)

        translations = [
            TemplateTranslation(
                language=lang,
                title=title_,
                description=desc_,
                template_id=db_template.id
            )
            for lang, title_, desc_ in [
                ("uz", title_uz, desc_uz),
                ("ru", title_ru, desc_ru),
                ("en", title_en, desc_en)
            ]
        ]
        session.add_all(translations)

        features_data = json.loads(features)
        for feature in features_data:
            db_feature = Feature(
                available=feature['available'], template_id=db_template.id)
            session.add(db_feature)
            await session.flush()

            text_uz, text_ru, text_en = await handle_translations(feature['text'])
            feature_translations = [
                FeatureTranslation(language=lang, text=text_,
                                   feature_id=db_feature.id)
                for lang, text_ in [
                    ("uz", text_uz),
                    ("ru", text_ru),
                    ("en", text_en)
                ]
            ]
            session.add_all(feature_translations)

        for idx, image in enumerate(images):
            file_ext = Path(image.filename).suffix
            image_path = images_dir / f"{slug}_{idx}{file_ext}"
            await save_image_file(image, image_path)

            session.add(Image(
                url=str(image_path.relative_to(settings.PROJECT_DIR)),
                template_id=db_template.id
            ))

        current_user.is_verified = True
        session.add(current_user)

        await session.commit()
        await send_file_to_telegram(slug)

        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"message": "Template created successfully"}
        )

    except Exception as e:
        await session.rollback()

        if template_dir and template_dir.exists():
            shutil.rmtree(template_dir)
        if images_dir and images_dir.exists():
            shutil.rmtree(images_dir)

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Template creation failed: {str(e)}"
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
            db_category = await db.scalar(
                select(Category).where(Category.slug == category)
            )
            if not db_category:
                raise HTTPException(
                    status_code=404, detail="Category not found")
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

        total_templates = await db.scalar(
            select(func.count()).select_from(query.subquery())
        )

        templates = await db.scalars(
            query.offset((page - 1) * per_page).limit(per_page)
        )

        total_pages = (total_templates + per_page - 1) // per_page

        return {
            "data": templates.all(),
            "current_page": page,
            "per_page": per_page,
            "total_pages": total_pages,
            "total_templates": total_templates,
            "has_next": page < total_pages,
            "has_previous": page > 1,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )


@router.get("/{slug}")
async def read_template(
    slug: str,
    session: AsyncSession = Depends(get_db_session)
):
    try:
        template = await session.scalar(
            select(Template)
            .where(Template.slug == slug)
            .options(
                selectinload(Template.translations),
                selectinload(Template.images),
                selectinload(Template.features).selectinload(
                    Feature.translations),
                selectinload(Template.ratings)
            )
        )

        if template is None:
            raise HTTPException(status_code=404, detail="Template not found")

        return template

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch template: {str(e)}"
        )


@router.get("/download/{slug}")
async def download_template(
    slug: str,
    session: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(current_auth_user),
):

    template = await session.scalar(
        select(Template).where(Template.slug == slug)
    )
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    if template.current_price > 0:
        if not current_user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_406_NOT_ACCEPTABLE,
                detail="Please add one template and your account will be verified"
            )

    if '.' not in slug:
        file_path = settings.TEMPLATES_DIR / slug / f"{slug}.zip"
        media_type = 'application/zip'
        filename = f"{slug}.zip"
    else:
        file_path = settings.DOCS_DIR / "documents" / slug
        ext = slug.split('.')[-1]
        media_type = f"application/{ext}"
        filename = slug

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Template file not found")

    template.downloads += 1
    await session.commit()

    return FileResponse(
        path=file_path,
        media_type=media_type,
        filename=filename
    )


@router.get("/{slug}/{path:path}")
async def get_template_file(
    slug: str,
    path: str,
    session: AsyncSession = Depends(get_db_session)
):
    template = await session.scalar(
        select(Template).where(Template.slug == slug)
    )
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    template_dir = settings.TEMPLATES_DIR / slug
    if not template_dir.exists():
        raise HTTPException(
            status_code=404, detail="Template directory not found")

    file_path = template_dir / path
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path)


@router.patch("/add-like/{slug}")
async def add_like(
    slug: str,
    session: AsyncSession = Depends(get_db_session),
    _: User = Depends(current_auth_user),
):
    template = await session.scalar(
        select(Template).where(Template.slug == slug)
    )
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    template.likes += 1
    await session.commit()

    return template


@router.patch("/add-view/{slug}")
async def add_view(
    slug: str,
    session: AsyncSession = Depends(get_db_session),
    _: User = Depends(current_auth_user),
):
    template = await session.scalar(
        select(Template).where(Template.slug == slug)
    )
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    template.views += 1
    await session.commit()

    return template
