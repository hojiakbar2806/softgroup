import os
from fastapi.staticfiles import StaticFiles
from app import bot
from fastapi import FastAPI
from app.bot.webhook import setup_webhook
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, categories, users, templates

app = FastAPI(title="Template API", version="1.0.0")

os.makedirs("docs/static", exist_ok=True)
app.mount("/docs/static", StaticFiles(directory="docs/static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://templora.uz"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await setup_webhook()


app.include_router(auth.router, tags=["auth"])
app.include_router(users.router,  tags=["users"])
app.include_router(templates.router, tags=["templates"])
app.include_router(categories.router, tags=["categories"])
app.include_router(bot.webhook_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
