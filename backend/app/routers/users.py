from fastapi import APIRouter, Depends
from app.core.dependencies import current_auth_user
from app.models.user import User
from app.schemas.user import User as UserSchema

router = APIRouter()


@router.get("/me", response_model=UserSchema)
async def read_users_me(current_user: User = Depends(current_auth_user)):
    return current_user
