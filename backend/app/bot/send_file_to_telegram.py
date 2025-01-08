from app.bot.bot import bot
from app.core.config import settings
from aiogram.types import FSInputFile
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from app.models.template import Template
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.bot.session import get_db_session


async def send_file_to_telegram(slug: str):
    async with get_db_session() as session:
        query = select(Template).where(Template.slug == slug).options(
            selectinload(Template.images))
        result = await session.execute(query)
        template = result.scalar_one_or_none()

        if not template:
            await bot.send_message("❌ Template topilmadi!")

        url = f"{settings.BASE_URL}/templates/download/{template.slug}"

        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="✅", callback_data=f"verify_{template.slug}"),
                InlineKeyboardButton(
                    text="❌", callback_data=f"reject_{template.slug}"),
                InlineKeyboardButton(
                    text="🗑", callback_data=f"delete_{template.slug}"),
            ],
            [
                InlineKeyboardButton(
                    text="📥 Download", url=url)
            ]
        ])

        photo = FSInputFile(template.images[0].url)

        if template.is_verified:
            caption = f"✅ Template ({template.slug}) tasdiqlangan"
        else:
            caption = f"❌ Template ({template.slug}) tasdiqlanmagan"

    try:
        for chat_id in settings.CHAT_IDS:
            await bot.send_photo(
                chat_id=chat_id,
                photo=photo,
                reply_markup=keyboard,
                caption=caption
            )
        print(f"File link '{url}' successfully sent to Telegram.")
    except Exception as e:
        print(f"Error while sending file link to Telegram: {e}")
        raise
