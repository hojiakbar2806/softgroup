from app.bot.bot import bot
from app.core.config import settings
from aiogram.types import FSInputFile
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from app.models.template import Feature, Template
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.bot.session import get_db_session


from sqlalchemy.orm import selectinload


async def send_file_to_telegram(slug: str):
    try:

        async with get_db_session() as session:
            query = select(Template).where(Template.slug == slug).options(
                selectinload(Template.images),
                selectinload(Template.translations),
                selectinload(Template.features).selectinload(
                    Feature.translations)
            )
            result = await session.execute(query)
            template = result.scalar_one_or_none()

            if not template:
                await bot.send_message("❌ Template topilmadi!")
                return

            url = f"https://templora.uz/templates/{template.slug}"
            keyboard = InlineKeyboardMarkup(inline_keyboard=[
                [
                    InlineKeyboardButton(
                        text="✅", callback_data=f"verify_{template.slug}"),
                    InlineKeyboardButton(
                        text="❌", callback_data=f"reject_{template.slug}"),
                    InlineKeyboardButton(
                        text="🗑", callback_data=f"delete_{template.slug}"),
                ],
                [InlineKeyboardButton(text="View template", url=url)]
            ])

            text = f"""<b>Template ({template.slug})</b>\n
<b>Status:</b> {template.status.name}\n
<b>Description:</b> {template.translations[0].description if template.translations else 'No description available'}\n
"""

            for i, img in enumerate(template.images):
                text += f"<a href='{settings.BASE_URL}/{
                    img.url}'>View image {i}</a>\n"

            text += "\n<b>Features:</b>\n"

            for feature in template.features:
                availability = "✅" if feature.available else "❌"
                feature_text = feature.translations[0].text if feature.translations else "No feature description"
                text += f"<b>{feature_text}</b> {availability}\n"

            for chat_id in settings.CHAT_IDS:
                await bot.send_message(
                    chat_id=chat_id,
                    reply_markup=keyboard,
                    text=text,
                    parse_mode="HTML"
                )

            print(f"File link '{url}' successfully sent to Telegram.")

    except Exception as e:

        print(f"Error while sending file link to Telegram: {e}")
        raise
