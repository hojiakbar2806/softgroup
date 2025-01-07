from aiogram import types
from aiogram.filters import Filter

from app.core.config import settings


class IsAdmin(Filter):
    def __init__(self) -> None:
        pass

    async def __call__(self, message: types.Message) -> bool:
        chat_id = message.chat.id
        if chat_id not in settings.CHAT_IDS:
            await message.answer(
                "Sizda bu operatsiya uchun ruxsat yo'q",
                reply_markup=types.ReplyKeyboardRemove()
            )
            return False
        else:
            return True
