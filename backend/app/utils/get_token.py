from fastapi import HTTPException, Header


async def get_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Invalid token format")
    token = authorization[len("Bearer "):]
    return token
