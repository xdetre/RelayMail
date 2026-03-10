from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.services.alias_service import create_alias, get_user_aliases
from app.schemas.alias import AliasResponse



router = APIRouter()

@router.post("/aliases", response_model=AliasResponse)
async def new_alias(db: AsyncSession = Depends(get_db)):
    # временно user_id = 1
    alias = await create_alias(db, user_id=1)
    return alias


@router.get("/aliases", response_model=List[AliasResponse])
async def list_aliases(db: AsyncSession = Depends(get_db)):
    aliases = await get_user_aliases(db, user_id=1)
    return aliases