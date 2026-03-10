from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.alias import Alias
from app.utils.generator import generate_alias
from app.config import DOMAIN


async def create_alias(db: AsyncSession, user_id: int):
    alias_value = generate_alias()
    alias_email = f"{alias_value}@{DOMAIN}"

    alias = Alias(alias=alias_email, user_id=user_id)
    db.add(alias)
    await db.commit()
    await db.refresh(alias)
    return alias


async def get_user_aliases(db: AsyncSession, user_id: int):
    result = await db.execute(select(Alias.user_id==user_id))
    return result.scalars().all()