import string, random
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.temp_alias import TempAlias

from app.core.config import settings

from app.models.temp_email import TempEmail

def generate_alias() -> str:
    chars = string.ascii_lowercase + string.digits
    return "temp." + "".join(random.choices(chars, k=8))

async def get_temp_alias_count(db: AsyncSession, ip: str) -> int:
    now = datetime.utcnow()
    result = await db.execute(
        select(func.count()).where(
            TempAlias.ip == ip,
            TempAlias.expires_at > now
        )
    )
    return result.scalar()


async def create_temp_aliases(db: AsyncSession, ip: str, fingerprint: str) -> list[TempAlias]:
    # Проверяем лимит по IP
    count = await get_temp_alias_count(db, ip)
    if count >= settings.TEMP_ALIAS_LIMIT:
        raise ValueError("Limit reached for this IP")

    now = datetime.utcnow()
    ttl = timedelta(minutes=settings.TEMP_ALIAS_TTL_MINUTES)
    aliases = []

    for i in range(settings.TEMP_ALIAS_LIMIT - count):
        alias_str = generate_alias()
        # Каждый следующий алиас начинается позже
        expires_at = now + ttl * (i + 1)
        alias = TempAlias(
            alias=alias_str,
            ip=ip,
            fingerprint=fingerprint,
            expires_at=expires_at
        )
        db.add(alias)
        aliases.append(alias)

    await db.commit()
    for a in aliases:
        await db.refresh(a)

    return aliases


async def get_temp_alias(db: AsyncSession, alias: str) -> TempAlias | None:
    now = datetime.utcnow()
    result = await db.execute(
        select(TempAlias).where(
            TempAlias.alias == alias,
            TempAlias.expires_at > now
        )
    )
    return result.scalar_one_or_none()


async def cleanup_expired(db: AsyncSession):
    now = datetime.utcnow()
    result = await db.execute(
        select(TempAlias).where(TempAlias.expires_at <= now)
    )
    expired = result.scalars().all()
    for a in expired:
        await db.delete(a)
    await db.commit()


async def get_temp_emails(db: AsyncSession, alias: str) -> list[TempEmail]:
    temp = await get_temp_alias(db, alias)
    if not temp:
        return []
    result = await db.execute(
        select(TempEmail)
        .where(TempEmail.temp_alias_id == temp.id)
        .order_by(TempEmail.received_at.desc())
    )
    return result.scalars().all()


async def save_temp_email(db: AsyncSession, alias: str, sender: str, subject: str, body: str):
    temp = await get_temp_alias(db, alias)
    if not temp:
        return
    email = TempEmail(
        temp_alias_id=temp.id,
        sender=sender,
        subject=subject,
        body=body
    )
    db.add(email)
    await db.commit()