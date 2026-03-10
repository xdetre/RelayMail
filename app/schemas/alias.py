from pydantic import BaseModel

class AliasResponse(BaseModel):
    id: int
    alias: str
    is_active: bool

    class Config:
        from_attributes = True