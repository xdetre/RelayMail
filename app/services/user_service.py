from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.user import User
from app.core.security import hash_password

async def create_user(db: AsyncSession, email: str, password: str):

    hashed = hash_password(password)
    user = User(email=email, password_hash=hashed)

    db.add(user)
    await db.commit()
    await db.refresh(user)
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
