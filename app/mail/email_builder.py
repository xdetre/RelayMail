from app.core.config import settings

def build_alias_email(user_id: int, alias: str) -> str:
    return f"u{user_id}.{alias}@{settings.DOMAIN}"