from aiogram import Bot, Dispatcher
from app.core.config import settings
from app.bot.inline_message_handler import inline_router

bot = Bot(token=settings.BOT_TOKEN)
dispatch = Dispatcher()

dispatch.include_router(inline_router)

set_update = dispatch._process_update
