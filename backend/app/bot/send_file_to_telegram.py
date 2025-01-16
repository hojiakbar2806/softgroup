from app import bot
from app.core.config import settings
from app.models.template import Feature, Template
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.bot.session import get_db_session
from sqlalchemy.orm import selectinload
from aiogram.utils.keyboard import InlineKeyboardBuilder


def verify_template_kb(slug, url):
    ikm_b = InlineKeyboardBuilder()
    ikm_b.button(text="✅", callback_data=f"verify_{slug}")
    ikm_b.button(text="❌", callback_data=f"reject_{slug}")
    ikm_b.button(text="🗑", callback_data=f"delete_{slug}")
    ikm_b.button(text="Download", url=url)
    ikm_b.adjust(3)
    return ikm_b.as_markup()


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
                await bot.bot.send_message("❌ Template topilmadi!")
                return

            url = f"https://templora.uz/templates/{template.slug}"
            token = settings.BOT_TOKEN
            chat_id = settings.CHAT_IDS
            download_url = f"{
                settings.BASE_URL}/templates/download-moderator/{template.slug}/{chat_id[0]}/{token}"

            text = f"""Template ({template.slug})
Status: {template.status}\n
Description: {
                template.translations[0].description if template.translations else 'No description available'}
\n"""

            for img in template.images:
                text += f"{settings.BASE_URL}/{img.url}\n"
            text += "\n**Features:**\n"

            for feature in template.features:
                availability = "✅" if feature.available else "❌"
                feature_text = feature.translations[0].text if feature.translations else "No feature description"
                text += f"**{feature_text}** {availability}\n"

            for chat_id in settings.CHAT_IDS:
                await bot.bot.send_message(
                    chat_id=chat_id,
                    reply_markup=verify_template_kb(slug, download_url),
                    text=text,
                    parse_mode="Markdown"
                )
                print(f"Message '{url}' to {chat_id} successfully sent")

    except Exception as e:
        print(f"Error while sending file link to Telegram: {e}")
        raise
