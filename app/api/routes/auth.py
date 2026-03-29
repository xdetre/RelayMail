from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from authlib.integrations.httpx_client import AsyncOAuth2Client

from app.core.config import settings
from app.db.session import get_db
from app.services.auth_service import get_or_create_google_user


router = APIRouter(prefix="/google", tags=["google"])


@router.get("/auth/google")
async def google_login():
    async with AsyncOAuth2Client(
        client_id=settings.GOOGLE_CLIENT_ID,
        redirect_uri=settings.GOOGLE_REDIRECT_URI,
        scope="openid email profile",
    ) as client:
        url, _ = client.create_authorization_url(
            "https://accounts.google.com/o/oauth2/v2/auth"
        )
    return RedirectResponse(url)


@router.get("/auth/google/callback")
async def google_callback(code: str, db: AsyncSession = Depends(get_db)):
    async with AsyncOAuth2Client(
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        redirect_uri=settings.GOOGLE_REDIRECT_URI,
    ) as client:
        await client.fetch_token(
            "https://oauth2.googleapis.com/token",
            code=code,
        )
        resp = await client.get("https://www.googleapis.com/oauth2/v3/userinfo")
        user_info = resp.json()

    access_token = await get_or_create_google_user(db, user_info["email"])
    return RedirectResponse(f"http://localhost:5173?token={access_token}")