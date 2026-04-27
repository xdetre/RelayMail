from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.api.deps import rate_limit
from app.core.config import settings

from app.services.temp_service import create_temp_aliases, get_temp_alias, get_temp_emails


router = APIRouter(tags=["temp"])


@router.post("/temp/create")
async def create_temp_aliases_endpoint(request: Request, db: AsyncSession = Depends(get_db), _: None = Depends(rate_limit)):
    ip = request.client.host
    fingerprint = request.headers.get("user-agent", "")
    try:
        aliases = await create_temp_aliases(db, ip, fingerprint)
        return [{"alias": a.alias, "alias_email": f"{a.alias}@{settings.DOMAIN}", "expires_at": str(a.expires_at)} for a in aliases]
    except ValueError as e:
        raise HTTPException(status_code=429, detail=str(e))


@router.get("/temp/{alias}/emails")
async def get_temp_emails_endpoint(alias: str, db: AsyncSession = Depends(get_db)):
    temp = await get_temp_alias(db, alias)
    if not temp:
        raise HTTPException(status_code=404, detail="Alias not found or expired")

    emails = await get_temp_emails(db, alias)
    return {
        "alias": f"{alias}@{settings.DOMAIN}",
        "expires_at": temp.expires_at,
        "emails": [
            {
                "id": e.id,
                "sender": e.sender,
                "subject": e.subject,
                "body": e.body,
                "received_at": e.received_at
            }
            for e in emails
        ]
    }

