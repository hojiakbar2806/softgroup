import re
from pydantic import BaseModel, EmailStr, Field, field_validator, validator
from typing import List, Optional


class UserBase(BaseModel):
    full_name: str
    username: str
    email: EmailStr
    phone_number: str

    @field_validator('phone_number')
    def validate_phone_number(cls, v):
        if not v.startswith('+998'):
            raise ValueError('Phone number must start with +998')
        if not re.match(r'^\+998\d{9}$', v):
            raise ValueError('Invalid phone number format (+998XXXXXXXXX)')
        return v


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

    @field_validator('name')
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
