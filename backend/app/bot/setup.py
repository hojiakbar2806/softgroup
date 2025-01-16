from aiogram import Bot, Dispatcher
from app.core.config import settings
from app.bot.handler.inline_message_handler import inline_message_router
from app.bot.handler.command_handler import command_router
from app.bot.handler.search_state_handler import search_state_router

bot = Bot(token=settings.BOT_TOKEN)
dispatch = Dispatcher()

dispatch.include_router(command_router)
dispatch.include_router(search_state_router)
dispatch.include_router(inline_message_router)


set_update = dispatch._process_update
