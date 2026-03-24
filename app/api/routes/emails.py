from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.email import Email
from app.models.alias import Alias
from app.api.deps import get_current_user

router = APIRouter(prefix="/emails", tags=["emails"])


@router.get("/")
async def get_emails(db: AsyncSession = Depends(get_db), user = Depends(get_current_user)):
    result = await db.execute(select(Email).join(Alias).where(Alias.user_id == user.id))
    return result.scalars().all()