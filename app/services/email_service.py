from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.alias import Alias
from app.models.user import User




async def resolve_alias(db: AsyncSession, user_id: int, alias_value: str):

    result = await db.execute(select(Alias).where(Alias.user_id == user_id, Alias.alias == alias_value, Alias.is_active == True))

    alias = result.scalar_one_or_none()

    if not alias:
        return None

    result = db.execute(select(User).where(User.id == user_id))

    user = result.scalar_one()

    return user.email