FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y curl && \
    curl -sSL https://install.python-poetry.org | python3 - && \
    apt-get clean

ENV PATH="/root/.local/bin:$PATH"

COPY pyproject.toml poetry.lock /app/

RUN poetry install --no-root

COPY . /app/

EXPOSE 8000

ENTRYPOINT ["sh", "-c", "poetry run alembic upgrade head && poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000"]
