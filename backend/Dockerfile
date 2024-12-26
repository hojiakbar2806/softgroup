# Python asosiy tasviridan foydalanamiz
FROM python:3.12-slim

# Loyihaning ish katalogini o‘rnatish
WORKDIR /app

# Talablar faylini konteynerga nusxalash
COPY requirements.txt .

# Talablarni o‘rnatish
RUN pip install --no-cache-dir -r requirements.txt

# Flask ilovasini konteynerga nusxalash
COPY . .

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=8000

# Flask serverini ishga tushirish
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "app:app"]
