from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, DateTime, Text, ForeignKey
from app.db.session import Base
from datetime import datetime

class Email(Base):
    __tablename__ = 'emails'

    id: Mapped[int] = mapped_column(primary_key=True)
    alias_id: Mapped[int] = mapped_column(ForeignKey('aliases.id', ondelete='CASCADE'))
    sender: Mapped[str] = mapped_column(String)
    subject: Mapped[str] = mapped_column(String)
    body: Mapped[str] = mapped_column(Text, nullable=True)
    received_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    alias = relationship("Alias", back_populates="emails")
    # alias: Mapped["Alias"] = relationship()