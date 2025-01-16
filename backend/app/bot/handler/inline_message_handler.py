import os
import shutil
from aiogram import Router
from aiogram.types import CallbackQuery
from sqlalchemy.future import select

from app.bot.session import get_db_session
from app.models.template import Template
from sqlalchemy.orm import selectinload

inline_message_router = Router()


@inline_message_router.callback_query(lambda query: query.data.startswith('verify_') or query.data.startswith('reject_') or query.data.startswith('delete_'))
async def process_callback(callback_query: CallbackQuery):
    data = callback_query.data
    slug = data.split("_")[1]

    async with get_db_session() as session:
        query = select(Template).where(Template.slug == slug).options(
            selectinload(Template.owner),
        )
        result = await session.execute(query)
        template = result.scalars().first()

        if not template:
            await callback_query.answer("❌ Template topilmadi!")
            print("Template topilmadi!")

        if data.startswith("verify_"):
            template.status = "PUBLISHED"
            template.owner.is_verified = True
            await callback_query.answer("✅ Template muvafaqiyatli tasdiqlandi!")
            text = f"""✅ Template `{slug}` tasdiqlandi.

👤 Murojat qiluvchi: {template.owner.full_name}
📞 Telefon raqami: {template.owner.phone_number}
🌟 Status:{template.owner.is_verified}"""

            await callback_query.message.answer(text)
            await session.commit()
        elif data.startswith("reject_"):
            template.status = "REJECTED"
            await session.commit()
            await callback_query.answer("❌ Template muvafaqiyatli rad etildi!")
            await callback_query.message.answer(f"❌ Template `{slug}` rad etildi.")
        elif data.startswith("delete_"):
            if len(slug.split(".")) == 1:
                current_template = os.path.join("docs", "templates", slug)
                if os.path.exists(current_template):
                    shutil.rmtree(current_template)
            else:
                file_path = os.path.join("docs", slug)
                if os.path.exists(file_path):
                    os.remove(file_path)

            template_images = os.path.join(
                "docs", "static", "images", "templates", slug)
            if os.path.exists(template_images):
                shutil.rmtree(template_images)

            await session.delete(template)
            await session.commit()
            await callback_query.answer("🗑 Template muvafaqiyatli o'chirildi")
            await callback_query.message.answer(f"🗑 Template `{slug}` o'chirildi.")

    await callback_query.message.delete()
