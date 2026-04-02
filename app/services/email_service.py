from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.alias import Alias
from app.models.user import User

import random, resend
from app.core.config import settings


resend.api_key = settings.RESEND_API_KEY

async def resolve_alias(db: AsyncSession, user_id: int, alias_value: str):
    result = await db.execute(select(Alias).where(Alias.user_id == user_id, Alias.alias == alias_value, Alias.is_active == True))
    alias = result.scalar_one_or_none()

    if not alias:
        return None

    result = db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one()

    return user.email



def generate_code() -> str:
    return str(random.randint(1000, 9999))

async def send_verification_email(to_email: str, code: str):
    resend.Emails.send({
        "from": "RelayMail <noreply@relaymails.dev>",
        "to": to_email,
        "subject": "RelayMail — verification code",
        "html": f"""
        <div style="font-family: monospace; background: #0a0a0f; color: #e2e8f0; padding: 48px; border-radius: 12px;">
            <h2 style="font-size: 20px; margin-bottom: 24px;">Verify your email</h2>
            <p style="font-size: 40px; letter-spacing: 12px; font-weight: bold; color: #3b82f6;">{code}</p>
            <p style="color: #64748b; margin-top: 24px; font-size: 13px;">Enter this code to complete your registration.</p>
        </div>
        """
    })