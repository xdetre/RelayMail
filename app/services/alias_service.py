import random
import string
import re

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select, func

from app.core.config import settings
from app.models.alias import Alias


def generate_random_alias(length: int = 8):
    alphabet = string.ascii_lowercase + string.digits
    return "".join(random.choice(alphabet) for _ in range(length))


async def create_alias(db: AsyncSession, user_id: int):
    # Проверяем лимит пользователя
    result = await db.execute(
        select(func.count()).where(Alias.user_id == user_id)
    )
    count = result.scalar()
    if count >= settings.MAX_ALIASES_PER_USER:
        raise ValueError(f"Alias limit reached ({settings.MAX_ALIASES_PER_USER} max)")

    MAX_RETRIES = 5
    for _ in range(MAX_RETRIES):
        alias_value = generate_random_alias()
        alias = Alias(alias=alias_value, user_id=user_id)
        db.add(alias)

        try:
            await db.commit()
            await db.refresh(alias)
            return alias
        except IntegrityError:
            await db.rollback()


async def get_user_aliases(db: AsyncSession, user_id: int):
    result = await db.execute(select(Alias).where(Alias.user_id==user_id))
    return result.scalars().all()


async def enable_alias(db: AsyncSession, alias_id: int, user_id: int):
    result = await db.execute(select(Alias).where(Alias.id == alias_id, Alias.user_id == user_id))

    alias = result.scalar_one_or_none()

    if not alias:
        return None

    alias.is_active = True
    await db.commit()
    return alias


async def disable_alias(db: AsyncSession, alias_id: int, user_id: int):
    result = await db.execute(select(Alias).where(Alias.id == alias_id, Alias.user_id == user_id))

    alias = result.scalar_one_or_none()

    if not alias:
        return None

    alias.is_active = False
    await db.commit()
    return alias


async def delete_alias(db: AsyncSession, alias_id: int, user_id: int):
    result = await db.execute(select(Alias).where(Alias.id == alias_id, Alias.user_id == user_id))

    alias = result.scalar_one_or_none()

    if not alias:
        return None

    await db.delete(alias)
    await db.commit()
    return alias


async def create_custom_alias(db: AsyncSession, user_id: int, name: str):
    # Валидация имени
    if not re.match(r'^[a-z0-9._-]+$', name):
        raise ValueError("Name can only contain lowercase letters, numbers, dots, hyphens and underscores")
    if len(name) < 2 or len(name) > 30:
        raise ValueError("Name must be between 2 and 30 characters")

    # Проверяем лимит
    result = await db.execute(select(func.count()).where(Alias.user_id == user_id))
    count = result.scalar()
    if count >= settings.MAX_ALIASES_PER_USER:
        raise ValueError(f"Alias limit reached ({settings.MAX_ALIASES_PER_USER} max)")

    # Проверяем что имя свободно
    existing = await db.execute(select(Alias).where(Alias.alias == name))
    if existing.scalar_one_or_none():
        raise ValueError(f"Alias '{name}' is already taken")

    alias = Alias(alias=name, user_id=user_id, is_custom=True)
    db.add(alias)
    try:
        await db.commit()
        await db.refresh(alias)
        return alias
    except IntegrityError:
        await db.rollback()
        raise ValueError("Alias already taken")

