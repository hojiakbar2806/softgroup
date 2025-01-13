from fastapi.responses import JSONResponse
from sqlalchemy import func
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import APIRouter, Depends
from app.core.dependencies import current_auth_user
from app.models.template import Feature, Template
from app.models.user import User
from app.schemas.template import PaginatedTemplateResponse
from app.schemas.user import User as UserSchema, ContactForm
from app.database.session import get_db_session

from app.bot.send_message import send_message

router = APIRouter(prefix="/users",)


@router.get("/me", response_model=UserSchema)
async def read_users_me(current_user: User = Depends(current_auth_user)):
    return current_user


@router.get("/templates", response_model=PaginatedTemplateResponse)
async def read_users_me(
    page: int = 1,
    per_page: int = 10,
    session: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(current_auth_user),
):
    query = select(Template).where(Template.owner_id == current_user.id)

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


@router.post("/contact")
async def contact(data: ContactForm):
    await send_message(data)
    return JSONResponse(status_code=200, content={"message": "Xabar muvaffaqiyatli yuborildi"})
