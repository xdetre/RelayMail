from pydantic import BaseModel, computed_field

class AliasResponse(BaseModel):
    id: int
    alias: str
    user_id: int
    is_active: bool
    is_custom: bool = False

    @computed_field
    @property
    def email(self) -> str:
        if self.is_custom:
            return f"{self.alias}@relaymails.dev"
        return f"u{self.user_id}.{self.alias}@relaymails.dev"

    class Config:
        from_attributes = True


class CustomAliasRequest(BaseModel):
    name: str