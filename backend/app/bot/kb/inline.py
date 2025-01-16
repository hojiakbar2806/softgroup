from aiogram.utils.keyboard import InlineKeyboardBuilder


def verify_template_kb(slug, url):
    ikm_b = InlineKeyboardBuilder()
    ikm_b.button(text="✅", callback_data=f"verify_{slug}")
    ikm_b.button(text="❌", callback_data=f"reject_{slug}")
    ikm_b.button(text="🗑", callback_data=f"delete_{slug}")
    ikm_b.button(text="View template", url=url)
    ikm_b.adjust(3)
    return ikm_b.as_markup()
