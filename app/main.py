from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.aliases import router as aliases_router
from app.api.routes.users import router as user_router
from app.api.routes.emails import router as emails_router
from app.api.routes.auth import router as auth_router
from app.api.routes.temp import router as temp_router
from app.api.routes.payments import router as payments_router

import asyncio
from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.services.temp_service import cleanup_expired

from datetime import datetime
from app.models.alias import Alias

app = FastAPI(title="RelayMailAPI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://relaymails.dev",  # добавь прод
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(aliases_router, prefix="/api")
app.include_router(user_router, prefix="/api")
app.include_router(emails_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(temp_router, prefix="/api")
app.include_router(payments_router, prefix="/api")


async def cleanup_task():
    while True:
        await asyncio.sleep(300)
        async with AsyncSessionLocal() as db:
            await cleanup_expired(db)

async def expire_aliases_task():
    while True:
        await asyncio.sleep(300)  # каждые 5 минут
        async with AsyncSessionLocal() as db:
            from sqlalchemy import update
            await db.execute(
                update(Alias)
                .where(Alias.expires_at <= datetime.utcnow(), Alias.is_active == True)
                .values(is_active=False)
            )
            await db.commit()

async def check_pro_expiry_task():
    while True:
        await asyncio.sleep(3600)  # каждый час
        async with AsyncSessionLocal() as db:
            from sqlalchemy import update
            await db.execute(
                update(User)
                .where(User.pro_until <= datetime.utcnow(), User.is_pro == True)
                .values(is_pro=False)
            )
            await db.commit()


@app.on_event("startup")
async def startup():
    asyncio.create_task(cleanup_task())
    asyncio.create_task(expire_aliases_task())
    asyncio.create_task(check_pro_expiry_task())