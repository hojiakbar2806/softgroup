from fastapi import Request
from app.bot.setup import bot
from app.schemas.user import ContactForm


async def send_message(contactForm: ContactForm):
    text = f"""
📝 Yangi Xabar 📝
👤 Ism: {contactForm.name}
📧 Email: {contactForm.email}
"""
    await bot.send_message(text=text, chat_id=-1002489508446)


async def send_user_details(name, email, phone, request: Request):
    client_ip = request.client.host
    user_agent = request.headers.get('User-Agent')
    referer = request.headers.get('Referer')
    body = await request.body()

    text = f"""
📝 Yangi User 📝
👤 Ism: {name}
📧 Email: {email}
📞 Telefon: {phone}
🌐 IP: {client_ip}
📱 Browser: {user_agent}
🔗 Referer: {referer}

{body}
"""
    await bot.send_message(text=text, chat_id=-1002489508446)
