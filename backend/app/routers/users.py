from statistics import mean
from fastapi.responses import JSONResponse
from sqlalchemy import func
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import APIRouter, Depends
from app.core.dependencies import current_auth_user
from app.models.template import Feature, Template
from app.models.user import User, UserLikes
from app.schemas.template import PaginatedTemplateResponse, TemplateResponse
from app.schemas.user import User as UserSchema, ContactForm
from app.database.session import get_db_session

from app.bot.send_message import send_message

router = APIRouter(prefix="/users",)


@router.get("/me", response_model=UserSchema)
async def read_users_me(current_user: User = Depends(current_auth_user)):
    return current_user


@router.get("/templates")
async def read_users_templates(
    session: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(current_auth_user),
):
    query = select(Template).where(Template.owner_id == current_user.id)

    query = query.options(
        selectinload(Template.translations),
        selectinload(Template.images),
    )
    result = await session.execute(query)
    return result.scalars().all()


@router.get("/templates/liked", response_model=PaginatedTemplateResponse)
async def read_liked_templates(
    page: int = 1,
    per_page: int = 10,
    session: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(current_auth_user),
):
    query = (
        select(Template)
        .join(UserLikes, UserLikes.template_id == Template.id)
        .where(UserLikes.user_id == current_user.id)
    )

    query = query.options(
        selectinload(Template.translations),
        selectinload(Template.images),
        selectinload(Template.features).selectinload(Feature.translations),
        selectinload(Template.ratings),
        selectinload(Template.reviews),
    )

    total_templates = await session.scalar(
        select(func.count()).select_from(query.subquery())
    )

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

    # Apply pagination and execute query
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await session.execute(query)
    templates = result.scalars().unique().all()

    # Calculate pagination info
    total_pages = (total_templates + per_page - 1) // per_page

    # Prepare response data
    data = []
    for template in templates:
        # Calculate average rating
        ratings = [
            r.rating for r in template.ratings] if template.ratings else [0]
        avg_rating = mean(ratings) if ratings else 0.0

        # Create template response with all required fields
        template_data = {
            "id": template.id,
            "slug": template.slug,
            "current_price": float(template.current_price),
            "original_price": float(template.original_price) if template.original_price else None,
            "downloads": template.downloads,
            "average_rating": float(avg_rating),
            "likes": template.likes,
            "views": template.views,
            "is_liked": True,  # These are all liked templates
            "ratings": [{"id": r.id, "rating": float(r.rating)} for r in template.ratings],
            "images": [{"id": img.id, "url": img.url} for img in template.images],
            "translations": [
                {
                    "title": t.title,
                    "language": t.language,
                    "description": t.description
                } for t in template.translations
            ],
            "features": [
                {
                    "id": f.id,
                    "available": f.available,
                    "translations": [
                        {
                            "text": ft.text,
                            "language": ft.language
                        } for ft in f.translations
                    ]
                } for f in template.features
            ],
            "reviews": [
                {
                    "id": r.id,
                    "rating": float(r.rating),
                    "comment": r.comment,
                    "is_liked": r.is_liked,
                    "user_id": r.user_id
                } for r in template.reviews
            ]
        }

        template_response = TemplateResponse.model_validate(template_data)
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


@router.post("/contact")
async def contact(data: ContactForm):
    await send_message(data)
    return JSONResponse(status_code=200, content={"message": "Xabar muvaffaqiyatli yuborildi"})
