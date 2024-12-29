from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.database.base import Base
from app.database.session import async_engine as engine
from fastapi.middleware.cors import CORSMiddleware


from app.routers import auth, users, templates

app = FastAPI(title="Template API", version="1.0.0")

app.mount("/templates", StaticFiles(directory="templates"), name="templates")

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


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/user", tags=["users"])
app.include_router(templates.router, prefix="/template", tags=["templates"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
