import json
import shutil

from pathlib import Path
from sqlalchemy import func
from typing import List, Optional
from sqlalchemy.future import select
from fastapi.security import HTTPBearer
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.responses import FileResponse, JSONResponse
from fastapi import APIRouter, Depends, File, Form, HTTPException,  UploadFile, status

from app.core.config import settings
from app.utils.slug import unique_slug
from app.models.user import User, UserLikes
from app.database.session import get_db_session
from app.utils.save_image import save_image_file
from app.utils.translate import handle_translations
from app.core.security.utils import verify_user_token
from app.utils.save_template import save_template_file
from app.core.dependencies import current_auth_user, get_token
from app.bot.send_file_to_telegram import send_file_to_telegram
from app.schemas.template import PaginatedTemplateResponse, TemplateResponse
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
        query = select(Category).where(Category.slug == category_slug)
        result = await session.execute(query)
        category = result.scalar_one_or_none()
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
                title=title,
                description=desc,
                template_id=db_template.id
            )
            for lang, title, desc in [
                ("uz", title_uz, desc_uz),
                ("ru", title_ru, desc_ru),
                ("en", title_en, desc_en)
            ]
        ]
        session.add_all(translations)

        features_data = json.loads(features)

        for feature in features_data:
            db_feature = Feature(
                available=feature['available'],
                template_id=db_template.id
            )
            session.add(db_feature)
            await session.flush()

            text_uz, text_ru, text_en = await handle_translations(feature['text'])

            feature_translations = [
                FeatureTranslation(
                    text=text,
                    language=lang,
                    feature_id=db_feature.id
                )
                for lang, text in [
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


auth_schema = HTTPBearer()


@router.get("", response_model=PaginatedTemplateResponse)
async def read_templates(
    page: int = 1,
    per_page: int = 10,
    slug: Optional[str] = None,
    category: Optional[str] = None,
    tier: Optional[str] = None,
    db: AsyncSession = Depends(get_db_session),
    token: str = Depends(get_token),
) -> PaginatedTemplateResponse:
    if page < 1 or per_page < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid pagination parameters"
        )

    user_likes = []

    if token:
        current_user = await verify_user_token(token, db, "access")

    if current_user:
        likes_query = select(UserLikes.template_id).where(
            UserLikes.user_id == current_user.id
        )
        result = await db.execute(likes_query)
        user_likes = result.scalars().all()
        print(user_likes)

    query = select(Template).where(Template.status == "PUBLISHED")

    if slug:
        query = query.where(Template.slug.ilike(f"%{slug}%"))

    if category:
        category_query = select(Category).where(Category.slug == category)
        db_category = await db.scalar(category_query)
        if not db_category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
        query = query.where(Template.category_id == db_category.id)

    if tier:
        if tier == "premium":
            query = query.where(Template.current_price > 0)
        else:
            query = query.where(Template.current_price == 0)

    query = query.options(
        selectinload(Template.translations),
        selectinload(Template.images),
        selectinload(Template.features).selectinload(Feature.translations),
        selectinload(Template.ratings),
        selectinload(Template.reviews),
    )

    count_query = select(func.count()).select_from(query.subquery())
    total_templates = await db.scalar(count_query)

    if total_templates == 0:
        return PaginatedTemplateResponse(
            data=[],
            current_page=page,
            per_page=per_page,
            total_pages=0,
            total_templates=0,
            has_next=False,
            has_previous=False,
        )

    query = query.offset((page - 1) * per_page).limit(per_page)

    result = await db.scalars(query)
    templates = result.all()

    total_pages = (total_templates + per_page - 1) // per_page

    data = []
    for template in templates:
        template_dict = {
            "id": template.id,
            "slug": template.slug,
            "current_price": template.current_price,
            "original_price": template.original_price,
            "downloads": template.downloads,
            "average_rating": 0,  # You may want to calculate the average rating here
            "likes": template.likes,
            "views": template.views,
            "is_liked": template.id in user_likes,  # Check if the template is liked
            "ratings": template.ratings,
            "images": template.images,
            "translations": template.translations,
            "features": template.features,
            "reviews": template.reviews
        }

        template_response = TemplateResponse.model_validate(template_dict)
        data.append(template_response)

    return PaginatedTemplateResponse(
        data=data,
        current_page=page,
        per_page=per_page,
        total_pages=total_pages,
        total_templates=total_templates,
        has_next=page < total_pages,
        has_previous=page > 1,
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


@router.get("/download-moderator/{slug}/{chat_id}/{token}")
async def download_template(
    slug: str,
    chat_id: str,
    token: str,
    session: AsyncSession = Depends(get_db_session),
):
    if not chat_id in settings.CHAT_IDS and token != settings.BOT_TOKEN:
        raise HTTPException(status_code=404, detail="You dont have access")

    template = await session.scalar(
        select(Template).where(Template.slug == slug)
    )
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

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
async def toggle_like(
    slug: str,
    session: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(current_auth_user),
):
    template = await session.scalar(
        select(Template).where(Template.slug == slug)
    )
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    query = select(UserLikes).where(
        UserLikes.user_id == current_user.id,
        UserLikes.template_id == template.id
    )
    result = await session.execute(query)
    existing_like = result.scalar_one_or_none()

    if existing_like:
        template.likes -= 1
        await session.delete(existing_like)
        await session.commit()
        return {"message": "Like removed"}

    else:
        template.likes += 1
        new_like = UserLikes(user_id=current_user.id, template_id=template.id)
        session.add(new_like)
        await session.commit()
        return {"message": "Like added"}


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
