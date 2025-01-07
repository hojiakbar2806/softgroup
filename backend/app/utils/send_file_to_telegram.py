from aiogram.types import InlineKeyboardButton, FSInputFile
from aiogram.utils.keyboard import InlineKeyboardBuilder
from app.bot.bot import bot
from app.core.config import settings


async def send_file_to_telegram(file_path: str, slug: str):
    ikb = InlineKeyboardBuilder()
    ikb.add(InlineKeyboardButton(
        text="✅ Verify", callback_data=f"verify_{slug}")
    )
    ikb.add(InlineKeyboardButton(
        text="❌ Reject", callback_data=f"reject_{slug}")
    )
    ikb.adjust(2)
    keyboard = ikb.as_markup()

    try:
        file = FSInputFile(file_path)
        for chat_id in settings.CHAT_IDS:
            await bot.send_document(
                chat_id=chat_id,
                document=file,
                caption=f"New Template: {slug}",
                reply_markup=keyboard
            )
        print(f"File '{file_path}' successfully sent to Telegram.")
    except Exception as e:
        print(f"Error while sending file to Telegram: {e}")
        raise
