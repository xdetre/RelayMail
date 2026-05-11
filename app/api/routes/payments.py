from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import httpx

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.core.config import settings

import uuid
from yookassa import Configuration, Payment as YooPayment

router = APIRouter(tags=["payments"])


@router.post("/payments/create")
async def create_invoice(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if user.is_pro:
        raise HTTPException(status_code=400, detail="Already on Pro plan")

    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://api.cryptocloud.plus/v2/invoice/create",
            headers={
                "Authorization": f"Token {settings.CRYPTOCLOUD_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "shop_id": settings.CRYPTOCLOUD_SHOP_ID,
                "amount": 1.00,
                "currency": "USD",
                "order_id": f"user_{user.id}",
                "email": user.email,
            }
        )

    data = res.json()
    if res.status_code != 200:
        raise HTTPException(status_code=500, detail="Payment creation failed")

    return {"pay_url": data["result"]["link"]}


@router.post("/payments/webhook")
async def payment_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    data = await request.json()

    # Проверяем статус
    if data.get("status") != "success":
        return {"ok": True}

    # Получаем user_id из order_id
    order_id = data.get("order_id", "")
    if not order_id.startswith("user_"):
        return {"ok": True}

    user_id = int(order_id.replace("user_", ""))

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user:
        user.is_pro = True
        await db.commit()

    return {"ok": True}


@router.post("/payments/create-card")
async def create_card_invoice(
    request: Request,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user.is_pro:
        raise HTTPException(status_code=400, detail="Already on Pro plan")

    Configuration.account_id = settings.YOOKASSA_SHOP_ID
    Configuration.secret_key = settings.YOOKASSA_SECRET_KEY

    payment = YooPayment.create({
        "amount": {
            "value": "99.00",  # рублей
            "currency": "RUB"
        },
        "confirmation": {
            "type": "redirect",
            "return_url": f"{settings.FRONTEND_URL}?payment=success"
        },
        "capture": True,
        "description": f"RelayMail Pro — {user.email}",
        "metadata": {
            "user_id": user.id
        }
    }, uuid.uuid4())

    return {"pay_url": payment.confirmation.confirmation_url}


@router.post("/payments/webhook-card")
async def card_payment_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    data = await request.json()

    if data.get("event") != "payment.succeeded":
        return {"ok": True}

    user_id = data.get("object", {}).get("metadata", {}).get("user_id")
    if not user_id:
        return {"ok": True}

    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalar_one_or_none()
    if user:
        user.is_pro = True
        await db.commit()

    return {"ok": True}