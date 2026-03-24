from app.core.security import create_access_token
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.user_service import get_user_by_email
from app.core.security import verify_password



async def authenticate_user(db: AsyncSession, email: str, password: str):

    user = await get_user_by_email(db, email)

    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    token = create_access_token(
        {"user_id": user.id}
    )

    return token