
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.api.deps import rate_limit, get_current_user
from app.core.security import create_access_token
from app.db.session import get_db
from app.schemas.user import UserCreate, UserResponse, TokenResponse, UserLogin, VerifyRequest, ResendRequest
from app.services.user_service import create_user
from app.services.auth_service import authenticate_user
from app.models.user import User
from datetime import datetime, timedelta

router = APIRouter(tags=["users"])

@router.post("/users/register", response_model=UserResponse)
async def register_user(data: UserCreate, db: AsyncSession = Depends(get_db), _: None = Depends(rate_limit)):
    try:
        user = await create_user(db, email=data.email, password=data.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return user


@router.post("/users/login", response_model=TokenResponse)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db), _: None = Depends(rate_limit)):
    token = await authenticate_user(db, data.email, data.password)

    return {"access_token": token}


@router.get("/users/me", response_model=UserResponse)
async def get_user(user: User = Depends(get_current_user)):
    return user


@router.post("/users/verify")
async def verify_email(data: VerifyRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if not user or user.verification_code != data.code:
        raise HTTPException(status_code=400, detail="Invalid code")

    user.is_verified = True
    user.verification_code = None
    await db.commit()

    token = create_access_token({"user_id": user.id})
    return {"access_token": token}


@router.post("/users/resend-code")
async def resend_code(data: ResendRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Проверка — не чаще раза в 60 секунд
    if user.code_sent_at and datetime.utcnow() - user.code_sent_at < timedelta(seconds=60):
        seconds_left = 60 - (datetime.utcnow() - user.code_sent_at).seconds
        raise HTTPException(status_code=429, detail=f"Wait {seconds_left} seconds")

    from app.services.email_service import generate_code, send_verification_email
    code = generate_code()
    user.verification_code = code
    user.code_sent_at = datetime.utcnow()
    await db.commit()

    await send_verification_email(user.email, code)
    return {"message": "Code sent"}