from aiogram import Router, Bot
from aiogram.filters import StateFilter
from app.bot.states import SearchState
from aiogram.types import FSInputFile
from aiogram.types import Message
from aiogram.fsm.context import FSMContext
from app.bot.session import get_db_session
from sqlalchemy.future import select
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from app.core.config import settings
from app.models.template import Template
from sqlalchemy.orm import selectinload
from app.bot.filters.admin_user import IsAdmin


search_state_router = Router()


@search_state_router.message(StateFilter(SearchState.search), IsAdmin())
async def search_state_handler(message: Message, state: FSMContext, bot: Bot):
    async with get_db_session() as session:
        query = select(Template).where(Template.slug == message.text).options(
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
                    text="✅ Verify", callback_data=f"verify_{template.slug}"),
                InlineKeyboardButton(
                    text="❌ Reject", callback_data=f"reject_{template.slug}")
            ],
            [
                InlineKeyboardButton(
                    text="📥 Download", url=url)
            ]
        ])

        photo = FSInputFile(template.images[0].url)

        await bot.send_photo(
            chat_id=message.chat.id,
            photo=photo,
            reply_markup=keyboard
        )

    await state.clear()
