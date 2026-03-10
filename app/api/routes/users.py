from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.user import UserCreate, UserResponse, TokenResponse, UserLogin
from app.services.user_service import create_user
from app.utils.jwt import authenticate_user

router = APIRouter()

@router.post("/user/register", response_model=UserResponse)
async def register_user(data: UserCreate, db: AsyncSession = Depends(get_db)):
    user = await create_user(db, email=data.email, password=data.password)

    return user


@router.post("/user/login", response_model=TokenResponse)
async def lgin(data: UserLogin, db: AsyncSession = Depends(get_db)):
    token = await authenticate_user(db,data.email, data.password)

    return {"access_token": token}