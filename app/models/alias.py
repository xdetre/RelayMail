from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, DateTime, ForeignKey
from app.db.session import Base
from datetime import datetime


class Alias(Base):
    __tablename__ = 'aliases'

    id: Mapped[int] = mapped_column(primary_key=True)
    alias: Mapped[str] = mapped_column(String, unique=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="aliases")
    emails = relationship("Email", back_populates="alias", cascade="all, delete-orphan")
    # user: Mapped[List["User"]] = relationship(back_populates="aliases")

