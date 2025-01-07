from aiogram import Router
from aiogram.types import Message
from aiogram.filters import Command, StateFilter
from app.bot.states import SearchState
from aiogram.fsm.context import FSMContext


from app.bot.session import get_db_session

command_router = Router()


@command_router.message(StateFilter(None), Command("search"))
async def handle_start(message: Message, state: FSMContext):
    await message.answer("Template slugini kiriting")
    await state.set_state(SearchState.search)
