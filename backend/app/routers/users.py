from typing import List
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import APIRouter, Depends
from app.core.dependencies import current_auth_user
from app.models.template import Feature, Template
from app.models.user import User
from app.schemas.template import TemplateResponse
from app.schemas.user import User as UserSchema
from app.database.session import get_db_session

router = APIRouter(prefix="/user",)


@router.get("/me", response_model=UserSchema)
async def read_users_me(current_user: User = Depends(current_auth_user)):
    return current_user


class TemplateResponseWithVerified(TemplateResponse):
    is_verified: bool


@router.get("/my-templates", response_model=List[TemplateResponseWithVerified])
async def read_users_me(current_user: User = Depends(current_auth_user), session: AsyncSession = Depends(get_db_session)):
    query = select(Template).where(Template.owner_id == current_user.id).options(
        selectinload(Template.translations),
        selectinload(Template.images),
        selectinload(Template.features).selectinload(Feature.translations),
        selectinload(Template.ratings),
    )
    result = await session.execute(query)
    templates = result.scalars().all()
    return templates
