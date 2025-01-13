from app.bot.bot import bot
from app.schemas.user import ContactForm


async def send_message(contactForm: ContactForm):
    text = f"""
📝 Yangi Xabar 📝
👤 Ism: {contactForm.name}
📧 Email: {contactForm.email}
"""
    await bot.send_message(text=text, chat_id=-1002489508446)
