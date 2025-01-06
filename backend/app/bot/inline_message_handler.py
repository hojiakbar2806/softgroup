from aiogram import Router
from aiogram.types import CallbackQuery
from sqlalchemy.future import select

from app.bot.session import get_db_session
from app.models.template import Template

inline_router = Router()


@inline_router.callback_query(lambda query: query.data.startswith('verify_') or query.data.startswith('reject_'))
async def process_callback(callback_query: CallbackQuery):
    data = callback_query.data
    slug = data.split("_")[1]

    if data.startswith("verify_"):
        async with get_db_session() as session:
            query = select(Template).where(Template.slug == slug)
            result = await session.execute(query)
            template = result.scalars().first()

            if template:
                template.is_verified = True
                await session.commit()
            else:
                await callback_query.answer("❌ Template topilmadi!")

        await callback_query.answer("✅ Template Verified!")
        await callback_query.message.answer(f"✅ Template `{slug}` tasdiqlandi.")

    elif data.startswith("reject_"):
        await callback_query.answer("❌ Template Rejected!")
        await callback_query.message.answer(f"❌ Template `{slug}` rad etildi.")

    return await callback_query.message.delete()
