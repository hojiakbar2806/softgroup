from aiogram import Router
from aiogram.types import Message

from app.bot.session import get_db_session
from app.models.template import Template

message_router = Router()

@message_router.message()
async def handle_message(message: Message, db: AsyncSession = Depends(get_db_session)):
    query = select(Template).where(Template.slug == message.text)
    result = await db.execute(query)
    template = result.scalar_one_or_none()
    if template:
        await message.answer(template.description)