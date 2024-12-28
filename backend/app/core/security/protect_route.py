from fastapi import HTTPException, status
from functools import wraps
from typing import List
from fastapi import Depends

from core.dependency import current_auth_user
from core.enums import RoleEnum
from models.user import User


def protected_route(required_roles: List[RoleEnum] = None):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user: User = Depends(current_auth_user), **kwargs):
            if required_roles is not None and current_user.role not in required_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not enough permissions"
                )
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator
