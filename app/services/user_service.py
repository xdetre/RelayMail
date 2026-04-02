from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.models.user import User
from app.core.security import hash_password
from app.services.email_service import generate_code, send_verification_email


async def create_user(db: AsyncSession, email: str, password: str):
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


