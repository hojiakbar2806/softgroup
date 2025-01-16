from aiogram import Router, Bot
from aiogram.types import Message
from aiogram.filters import StateFilter
from aiogram.fsm.context import FSMContext

from app.bot.states import SearchState
from app.bot.filters.admin_user import IsAdmin
from app.bot.send_file_to_telegram import send_file_to_telegram


search_state_router = Router()


@search_state_router.message(StateFilter(SearchState.search), IsAdmin())
async def search_state_handler(message: Message, state: FSMContext, bot: Bot):
    await send_file_to_telegram(message.text)
    await state.clear()
