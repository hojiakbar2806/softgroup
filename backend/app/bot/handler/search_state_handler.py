from aiogram import Router, Bot
from aiogram.types import Message
from sqlalchemy.future import select
from aiogram.types import FSInputFile
from aiogram.filters import StateFilter
from sqlalchemy.orm import selectinload
from aiogram.fsm.context import FSMContext
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup

from app.bot.session import get_db_session
from app.core.config import settings
from app.models.template import Template
from app.bot.states import SearchState
from app.bot.filters.admin_user import IsAdmin


search_state_router = Router()


@search_state_router.message(StateFilter(SearchState.search), IsAdmin())
async def search_state_handler(message: Message, state: FSMContext, bot: Bot):
    async with get_db_session() as session:
        query = select(Template).where(Template.slug == message.text).options(
            selectinload(Template.translations),
            selectinload(Template.images)
        )
        result = await session.execute(query)
        template = result.scalar_one_or_none()

        if not template:
            await message.answer("❌ Template topilmadi!")

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
        image = ""
        for img in template.images:
            image += f"\n{settings.BASE_URL}/{img.url}"

        if template.is_verified:
            text = f"""✅ ❌Template ({template.slug}) tasdiqlangan
{template.translations[0].description}
{image}"""
        else:
            text = f"""✅ Template ({template.slug}) tasdiqlanmagan
{template.translations[0].description}
{image}"""

        await bot.send_message(
            chat_id=message.chat.id,
            reply_markup=keyboard,
            text=text
        )

    await state.clear()
