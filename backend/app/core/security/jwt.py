import jwt
from fastapi import HTTPException
from datetime import datetime, timedelta
from app.core.config import settings


PRIVATE_KEY = settings.PRIVATE_KEY_PATH.read_text()
PUBLIC_KEY = settings.PUBLIC_KEY_PATH.read_text()
ALGORITHM = settings.ALGORITHM
SECRET_KEY = settings.SECRET_KEY
ACCESS_EXP_MIN = settings.ACCESS_TOKEN_EXPIRES_MINUTES
REFRESH_EXP_MIN = settings.REFRESH_TOKEN_EXPIRES_MINUTES
ACTIVATION_TOKEN_EXPIRES_MINUTS = settings.ACTIVATION_TOKEN_EXPIRES_MINUTS


def encode_jwt(payload: dict, token_type: str, expires_delta: timedelta) -> str:
    try:
        to_encode = payload.copy()
        now = datetime.utcnow()
        exp = now + expires_delta
        to_encode.update({"exp": exp, "iat": now, "type": token_type})
        return jwt.encode(to_encode, key=PRIVATE_KEY, algorithm=ALGORITHM)
    except jwt.PyJWTError as e:
        raise HTTPException(
            status_code=500, detail=f"Error creating token: {str(e)}"
        )


def decode_jwt(token: str) -> dict:
    try:
        payload = jwt.decode(token, PUBLIC_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error decoding token: {str(e)}"
        )


def create_access_token(sub: str) -> str:
    jwt_payload = {"sub": sub}
    expires_delta = timedelta(minutes=ACCESS_EXP_MIN)
    return encode_jwt(jwt_payload, "access", expires_delta)


def create_refresh_token(sub: str) -> str:
    jwt_payload = {"sub": sub}
    expires_delta = timedelta(minutes=REFRESH_EXP_MIN)
    return encode_jwt(jwt_payload, "refresh", expires_delta)


def generate_activation_token(payload: str) -> str:
    expires_delta = timedelta(minutes=ACTIVATION_TOKEN_EXPIRES_MINUTS)
    to_encode = {
        "sub": payload,
        "type": "Activation",
        "exp": datetime.utcnow() + expires_delta
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")


def decode_activation_token(token: str) -> dict:
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded_token
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error decoding token: {str(e)}"
        )
