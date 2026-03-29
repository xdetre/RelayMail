from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import rate_limit
from app.db.session import get_db
from app.schemas.user import UserCreate, UserResponse, TokenResponse, UserLogin
from app.services.user_service import create_user
from app.services.auth_service import authenticate_user

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/users/register", response_model=UserResponse)
async def register_user(data: UserCreate, db: AsyncSession = Depends(get_db), _: None = Depends(rate_limit)):
    user = await create_user(db, email=data.email, password=data.password)

    return user


@router.post("/users/login", response_model=TokenResponse)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db), _: None = Depends(rate_limit)):
    token = await authenticate_user(db, data.email, data.password)

    return {"access_token": token}