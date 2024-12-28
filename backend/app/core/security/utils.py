from sqlalchemy.future import select
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.core.security.jwt import decode_jwt


async def verify_user_token(token: str, session: AsyncSession, token_type: str) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_jwt(token)
    sub = payload.get("sub")

    if not sub:
        raise credentials_exception

    stmt = select(User).where(User.username == sub)
    user = (await session.execute(stmt)).scalar_one_or_none()

    if user is None:
        raise credentials_exception
    if token_type == "access" and payload.get("type") != "access":
        raise credentials_exception
    elif token_type == "refresh" and payload.get("type") != "refresh":
        raise credentials_exception
    return user
