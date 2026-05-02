from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

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