from aiogram import types, Bot
from aiogram.filters import Filter

from app.core.config import settings


class IsAdmin(Filter):
    def __init__(self) -> None:
        pass

    async def __call__(self, message: types.Message) -> bool:
        chat_id = message.chat.id
        text = "Sizda bu operatsiya uchun ruxsat yo'q"
        admins_chat_id = settings.CHAT_IDS
        if chat_id != chat_id not in admins_chat_id:
            await message.answer(text, reply_markup=types.ReplyKeyboardRemove())
            return False
        else:
            return True
