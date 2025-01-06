from pydantic import BaseModel, EmailStr
from typing import List, Optional


class UserBase(BaseModel):
    full_name: str
    username: str
    email: EmailStr
    phone_number: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
    permissions: List[str] = []
