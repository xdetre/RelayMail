from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.db.session import Base
from sqlalchemy import String, DateTime

class TempAlias(Base):
    __tablename__ = "temp_aliases"

    id: Mapped[int] = mapped_column(primary_key=True)
    alias: Mapped[str] = mapped_column(String, unique=True, nullable=True)
    ip: Mapped[str] = mapped_column(String, nullable=False)
    fingerprint: Mapped[str] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)