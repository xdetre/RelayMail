from pydantic import BaseModel, computed_field

class AliasResponse(BaseModel):
    id: int
    alias: str
    user_id: int
    is_active: bool

    @computed_field
    @property
    def email(self) -> str:
        return f"u{self.user_id}.{self.alias}@relaymails.dev"

    class Config:
        from_attributes = True
