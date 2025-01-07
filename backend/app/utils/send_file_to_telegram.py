from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from app.bot.bot import bot
from app.core.config import settings


async def send_file_to_telegram(slug: str):
    url = f"{settings.BASE_URL}/templates/download/{slug}"
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(
                text="✅ Verify", callback_data=f"verify_{slug}"),
            InlineKeyboardButton(
                text="❌ Reject", callback_data=f"reject_{slug}")
        ],
        [
            InlineKeyboardButton(
                text="📥 Download", url=url)
        ]
    ])

    try:
        for chat_id in settings.CHAT_IDS:
            await bot.send_message(
                chat_id=chat_id,
                text=f"New Template: {slug}",
                reply_markup=keyboard
            )
        print(f"File link '{url}' successfully sent to Telegram.")
    except Exception as e:
        print(f"Error while sending file link to Telegram: {e}")
        raise
