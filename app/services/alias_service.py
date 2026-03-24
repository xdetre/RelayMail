import random
import string

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select

from app.models.alias import Alias


def generate_random_alias(length: int = 8):
    alphabet = string.ascii_lowercase + string.digits
    return "".join(random.choice(alphabet) for _ in range(length))


async def create_alias(db: AsyncSession, user_id: int):
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