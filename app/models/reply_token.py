from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, DateTime, ForeignKey
from app.db.session import Base
from datetime import datetime
from typing import Optional

class ReplyToken(Base):
    __tablename__ = "reply_tokens"

    id: Mapped[int] = mapped_column(primary_key=True)
    token: Mapped[str] = mapped_column(String, unique=True, index=True)
    alias_id: Mapped[int] = mapped_column(ForeignKey("aliases.id", ondelete="CASCADE"))
    original_sender: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)