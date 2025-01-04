from datetime import datetime, timedelta
from fastapi.responses import JSONResponse

from app.core.config import settings


def set_refresh_token_cookie(response: JSONResponse, refresh_token: str):
    expires = datetime.utcnow() + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRES_MINUTES)
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        expires=int(expires.timestamp()),
        httponly=True,
        secure=True,
        samesite="None",
    )
