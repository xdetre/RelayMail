from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.db.session import Base
from sqlalchemy import String, DateTime, Text, ForeignKey


class TempEmail(Base):
    __tablename__ = "temp_emails"

    id: Mapped[int] = mapped_column(primary_key=True)
    temp_alias_id: Mapped[int] = mapped_column(ForeignKey("temp_aliases.id"), nullable=False)
    sender: Mapped[str] = mapped_column(String, nullable=False)
    subject: Mapped[str] = mapped_column(String, nullable=True)
    body: Mapped[str] = mapped_column(Text, nullable=True)
    received_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)