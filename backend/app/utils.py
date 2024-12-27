import jwt
from datetime import datetime, timedelta
from app.config import Config


def create_jwt(payload, expiration_seconds):
    payload["exp"] = datetime.utcnow() + timedelta(seconds=expiration_seconds)
    return jwt.encode(payload, Config.JWT_SECRET, algorithm=Config.JWT_ALGORITHM)


def create_access_token(user):
    return create_jwt({"user_id": user.id, "username": user.username}, Config.JWT_EXP_DELTA_SECONDS)


def create_refresh_token(user):
    return create_jwt({"user_id": user.id, "username": user.username}, Config.JWT_EXP_DELTA_SECONDS)


def decode_jwt(token):
    try:
        payload = jwt.decode(token, Config.JWT_SECRET,
                             algorithms=[Config.JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def verify_jwt(token):
    payload = decode_jwt(token)
    if payload is None:
        return False
    return True
