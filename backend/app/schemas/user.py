from pydantic import BaseModel
from typing import List, Optional

class UserBase(BaseModel):
    full_name: str
    username: str
    email: str
    phone_number: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    permissions: List[str] = []

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    permissions: List[str] = []

