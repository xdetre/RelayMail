from pydantic import BaseModel, computed_field
from typing import Optional
from datetime import datetime

class AliasResponse(BaseModel):
    id: int
    alias: str
    user_id: int
    is_active: bool
    is_custom: bool = False
    label: Optional[str] = None
    leak_detected: bool = False
    expires_at: Optional[datetime] = None

    @computed_field
    @property
    def email(self) -> str:
        if self.is_custom:
            return f"{self.alias}@relaymails.dev"
        return f"u{self.user_id}.{self.alias}@relaymails.dev"

    class Config:
        from_attributes = True

class CreateAliasRequest(BaseModel):
    created_for: Optional[str] = None

class CustomAliasRequest(BaseModel):
    name: str

class AliasLabelUpdate(BaseModel):
    label: str | None = None