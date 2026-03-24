from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.services.alias_service import create_alias, get_user_aliases
from app.schemas.alias import AliasResponse
from app.api.deps import get_current_user
from app.models.user import User

from app.services.alias_service import enable_alias, disable_alias, delete_alias

from app.api.deps import rate_limit

router = APIRouter()

@router.post("/aliases", response_model=AliasResponse)
async def new_alias(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db), _: None = Depends(rate_limit)):
    alias = await create_alias(db, user_id=current_user.id)
    return alias


@router.get("/aliases", response_model=List[AliasResponse])
async def list_aliases(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    aliases = await get_user_aliases(db, user_id=current_user.id)
    return aliases


@router.patch("/aliases/{alias_id}/enable")
async def enable_alias_endpoint(alias_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):

    return await enable_alias(
        db,
        alias_id,
        current_user.id
    )

@router.patch("/aliases/{alias_id}/disable")
async def disable_alias_endpoint(alias_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):

    return await disable_alias(
        db,
        alias_id,
        current_user.id
    )

@router.delete("/aliases/{alias_id}")
async def delete_alias_endpoint(
    alias_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):

    return await delete_alias(
        db,
        alias_id,
        current_user.id
    )