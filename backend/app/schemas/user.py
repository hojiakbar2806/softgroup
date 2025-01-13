import re
from pydantic import BaseModel, EmailStr, Field, validator
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
    is_verified: bool


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
    permissions: List[str] = []


class ContactForm(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=50
    )
    email: EmailStr

    @validator('name')
    def validate_name(cls, v):
        # HTML teglar, JavaScript kod va maxsus belgilarni tekshirish
        dangerous_patterns = [
            r'<[^>]*>',  # HTML teglar
            r'javascript:',  # JavaScript protokol
            r'onerror=',  # JavaScript event handler
            r'onclick=',
            r'onload=',
            r'onmouseover=',
            r'onfocus=',
            r'onblur=',
            r'alert\s*\(',
            r'document\.',
            r'window\.',
            r'console\.',
            r'eval\s*\(',
            r'setTimeout\s*\(',
            r'setInterval\s*\(',
            r'[\(\)\{\}<>]',  # Maxsus belgilar
            r'script',
            r'style',
            r'svg',
            r'img',
            r'iframe',
            r'object',
            r'embed',
            r'link',
            r'meta',
        ]

        for pattern in dangerous_patterns:
            if re.search(pattern, v, re.IGNORECASE):
                raise ValueError(
                    "Xavfsizlik xatosi: HTML, JavaScript yoki maxsus belgilar mumkin emas")

        if not re.match(r'^[a-zA-Z0-9\s]+$', v):
            raise ValueError(
                "Faqat harflar, raqamlar va bo'sh joy ishlatish mumkin")

        return v.strip()
