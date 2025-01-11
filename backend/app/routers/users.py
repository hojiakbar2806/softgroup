from typing import List, Optional
from sqlalchemy import func
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import APIRouter, Depends, HTTPException
from app.core.dependencies import current_auth_user
from app.models.template import Category, Feature, Template
from app.models.user import User
from app.schemas.template import PaginatedTemplateResponse, TemplateResponse
from app.schemas.user import User as UserSchema
from app.database.session import get_db_session

router = APIRouter(prefix="/users",)


@router.get("/me", response_model=UserSchema)
async def read_users_me(current_user: User = Depends(current_auth_user)):
    return current_user


@router.get("/templates", response_model=PaginatedTemplateResponse)
async def read_users_me(
    page: int = 1,
    per_page: int = 10,
    slug: Optional[str] = None,
    category: Optional[str] = None,
    tier: Optional[str] = None,
    session: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(current_auth_user),
):
    query = select(Template).where(Template.owner_id == current_user.id)

    if slug:
        query = query.where(Template.slug.contains(slug))

    if category:
        db_category = await session.scalar(
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
    total_templates = await session.scalar(
        select(func.count()).select_from(query.subquery())
    )

    templates = await session.scalars(
        query.offset((page - 1) * per_page).limit(per_page)
    )

    total_pages = (total_templates + per_page - 1) // per_page

    result = await session.execute(query)
    templates = result.scalars()
    return {
        "data": templates.all(),
        "current_page": page,
        "per_page": per_page,
        "total_pages": total_pages,
        "total_templates": total_templates,
        "has_next": page < total_pages,
        "has_previous": page > 1,
    }
