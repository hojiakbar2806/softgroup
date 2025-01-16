from aiogram import types
from fastapi import APIRouter
from app.core.config import settings
from app.bot.setup import set_update, bot

WEBHOOK_PATH = f"/bot/{settings.BOT_TOKEN}"
WEBHOOK_URL = settings.WEBHOOK_URL + WEBHOOK_PATH


async def setup_webhook():
    try:
        webhook_info = await bot.get_webhook_info()
        if webhook_info.url != WEBHOOK_URL:
            await bot.delete_webhook()
            await bot.set_webhook(WEBHOOK_URL)
            await bot.set_my_commands(
                [
                    types.BotCommand(
                        command="/search",
                        description="🔎 Template Qidirish",
                    ),
                ]
            )
        print(f"Bot Webhook  Successfully Set to: {WEBHOOK_URL}")
    except Exception as e:
        print(e)


webhook_router = APIRouter()


@webhook_router.post(WEBHOOK_PATH, tags=["Bot update"])
async def bot_webhook(update: dict):
    try:
        telegram_update = types.Update(**update)
        await set_update(bot, telegram_update)
    except Exception as e:
        print(e)
