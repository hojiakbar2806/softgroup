import os
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.database.base import Base
from app.database.session import async_engine as engine
from fastapi.middleware.cors import CORSMiddleware


from app.routers import auth, categories, users, templates

app = FastAPI(title="Template API", version="1.0.0")

os.makedirs(settings.DOCS_DIR, exist_ok=True)

app.mount(f"/{settings.DOCS_DIR}", StaticFiles(directory=settings.DOCS_DIR))

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://templates.softgroup.uz"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    if request.url.path.startswith("/docs"):
        print(f"Static file requested: {request.url.path}")
    response = await call_next(request)
    return response


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/user", tags=["users"])
app.include_router(templates.router, prefix="/templates", tags=["templates"])
app.include_router(categories.router, prefix="/categories", tags=["categoris"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
