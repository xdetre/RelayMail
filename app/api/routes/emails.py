from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select,func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import extract
import re

from app.db.session import get_db
from app.models.email import Email
from app.models.alias import Alias
from app.api.deps import get_current_user

router = APIRouter(tags=["emails"])



@router.get("/")
async def get_emails(db: AsyncSession = Depends(get_db), user = Depends(get_current_user)):
    result = await db.execute(select(Email).join(Alias).where(Alias.user_id == user.id))
    return result.scalars().all()


#письма для конкретного Алиаса
@router.get("/aliases/{alias_id}/emails")
async def get_alias_emails(alias_id: int, db: AsyncSession = Depends(get_db), user = Depends(get_current_user)):
    # Проверяем что алиас принадлежит пользователю
    alias = await db.execute(select(Alias).where(Alias.id == alias_id, Alias.user_id == user.id))
    alias = alias.scalar_one_or_none()
    if not alias:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Alias not found")

    result = await db.execute(
        select(Email)
        .where(Email.alias_id == alias_id)
        .order_by(Email.received_at.desc())
        .limit(50)
    )
    return result.scalars().all()


@router.delete("/emails/{email_id}")
async def delete_email(email_id: int, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    result = await db.execute(
        select(Email).join(Alias).where(Email.id == email_id, Alias.user_id == user.id)
    )
    email = result.scalar_one_or_none()
    if not email:
        raise HTTPException(status_code=404, detail="Not found")
    await db.delete(email)
    await db.commit()
    return {"ok": True}


@router.get("/aliases/{alias_id}/stats")
async def get_alias_stats(alias_id: int, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    # Проверяем что алиас принадлежит пользователю
    alias = await db.execute(select(Alias).where(Alias.id == alias_id, Alias.user_id == user.id))
    if not alias.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Alias not found")

    # Топ отправителей (извлекаем домен из email)
    senders_result = await db.execute(
        select(Email.sender, func.count(Email.id).label("count"))
        .where(Email.alias_id == alias_id)
        .group_by(Email.sender)
        .order_by(func.count(Email.id).desc())
        .limit(10)
    )
    senders = senders_result.all()

    # Группируем по доменам
    domain_counts = {}
    for sender, count in senders:
        match = re.search(r'@([\w.-]+)', sender)
        domain = match.group(1) if match else sender
        domain_counts[domain] = domain_counts.get(domain, 0) + count

    top_domains = sorted(domain_counts.items(), key=lambda x: x[1], reverse=True)[:10]

    # Активность по дням (последние 30 дней)
    activity_result = await db.execute(
        select(
            func.date(Email.received_at).label("date"),
            func.count(Email.id).label("count")
        )
        .where(Email.alias_id == alias_id)
        .group_by(func.date(Email.received_at))
        .order_by(func.date(Email.received_at).desc())
        .limit(30)
    )
    activity = activity_result.all()

    return {
        "total": sum(c for _, c in top_domains),
        "top_domains": [{"domain": d, "count": c} for d, c in top_domains],
        "activity": [{"date": str(row.date), "count": row.count} for row in activity]
    }