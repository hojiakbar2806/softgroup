from sqlalchemy import select
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Cookie, Depends, HTTPException, status

from app.core.dependencies import current_auth_user
from app.core.security.jwt import create_access_token, create_refresh_token
from app.core.security.utils import verify_user_token
from app.database.session import get_db_session
from app.utils.set_cookie import set_refresh_token_cookie
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin

router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, session: AsyncSession = Depends(get_db_session)):
    query = select(User).where(User.email == user.email)
    db_user = (await session.execute(query)).scalar_one_or_none()

    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        full_name=user.full_name,
        username=user.username,
        email=user.email,
        phone_number=user.phone_number
    )
    new_user.set_password(user.password)
    session.add(new_user)

    await session.commit()
    await session.refresh(new_user)

    refresh_token = create_refresh_token(sub=new_user.username)
    response = JSONResponse(
        content={"message": "User registered successfully"},
        status_code=status.HTTP_201_CREATED
    )
    set_refresh_token_cookie(response, refresh_token)
    return response


@router.post("/login")
async def login_user(user_in: UserLogin, session: AsyncSession = Depends(get_db_session)):
    query = select(User).where(User.username == user_in.username)
    user = (await session.execute(query)).scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user or not user.check_password(user_in.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    refresh_token = create_refresh_token(sub=user.username)
    access_token = create_access_token(sub=user.username)
    response = JSONResponse(
        status_code=200,
        content={"message": "Login successfully", "access_token": access_token}
    )
    set_refresh_token_cookie(response, refresh_token)
    return response


@router.post("/logout")
def logout_user(refresh_token: str = Cookie(None)):
    if not refresh_token:
        raise HTTPException(status_code=404, detail="You are not logged in")
    response = JSONResponse(
        status_code=200,
        content={"message": "Logout successfully"}
    )
    response.set_cookie(
        key="refresh_token",
        httponly=True,
        secure=True,
        samesite="None",
        expires=0
    )
    return response


@router.post("/refresh-token")
async def refresh_session(
    refresh_token: str = Cookie(None),
    session: AsyncSession = Depends(get_db_session)
):
    if not refresh_token:
        raise HTTPException(status_code=400, detail="You are not logged in")

    user = await verify_user_token(refresh_token, session, "refresh")
    access_token = create_access_token(user.username)

    return JSONResponse(
        status_code=200,
        content={
            "message": "Access token successfully refreshed",
            "access_token": access_token
        }
    )
