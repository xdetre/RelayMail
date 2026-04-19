from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.core.config import settings
from app.models.user import User
from app.core.security import hash_password
from app.services.email_service import generate_code, send_verification_email

import httpx


async def create_user(db: AsyncSession, email: str, password: str):
    if email.lower().endswith("@relaymails.dev"):
        raise ValueError("Registration with this domain is not allowed")
    hashed = hash_password(password)
    code = generate_code()
    user = User(email=email, password_hash=hashed, verification_code=code, is_verified=False)

    db.add(user)
    try:
        await db.commit()
        await db.refresh(user)
    except IntegrityError:
        await db.rollback()
        raise ValueError("Email already registered")

    await send_verification_email(email, code)
    return user


async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def create_google_user(db: AsyncSession, email: str):
    user = User(email=email, password_hash=None)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

async def verify_turnstile(token: str) -> bool:
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            data={
                "secret": settings.TURNSTILE_SECRET_KEY,
                "response": token,
            }
        )
        return res.json().get("success", False)

