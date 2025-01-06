import os
from aiogram import types
from app.core.config import settings
from aiohttp import web
from app.bot.bot import bot
from fastapi import APIRouter
from app.bot.bot import set_update

WEBHOOK_PATH = f"/bot/{settings.BOT_TOKEN}"
WEBHOOK_URL = settings.WEBHOOK_URL + WEBHOOK_PATH


async def setup_webhook():
    try:
        webhook_info = await bot.get_webhook_info()
        if webhook_info.url != WEBHOOK_URL:
            await bot.delete_webhook()
            await bot.set_webhook(WEBHOOK_URL)
    except Exception as e:
        print(e)


webhook_router = APIRouter()


@webhook_router.post(WEBHOOK_PATH, tags=["Bot update"])
async def bot_webhook(update: dict):
    # send_to_telegram(os.path.join(settings.DOCS_DIR))
    try:
        telegram_update = types.Update(**update)
        await set_update(bot, telegram_update)
    except Exception as e:
        print(e)
