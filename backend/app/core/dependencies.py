from fastapi import Depends
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.models.user import User
from app.database.session import get_db_session
from app.core.security.utils import verify_user_token

auth_schema = HTTPBearer()


async def current_auth_user(auth: HTTPAuthorizationCredentials = Depends(auth_schema), session: AsyncSession = Depends(get_db_session)) -> User:
    return await verify_user_token(auth.credentials, session, "access")