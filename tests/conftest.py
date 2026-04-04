import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from unittest.mock import patch

from app.main import app
from app.db.session import Base, get_db
from app.api.deps import rate_limit

TEST_DB_URL = "postgresql+asyncpg://relay:relay@localhost:5432/relaymail_test"


async def override_rate_limit():
    pass


async def mock_verify_turnstile(token: str) -> bool:
    return True


app.dependency_overrides[rate_limit] = override_rate_limit



@pytest.fixture
async def client():
    engine = create_async_engine(TEST_DB_URL)
    TestSession = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    patch("app.api.routes.users.verify_turnstile", mock_verify_turnstile).start()

    async def override_get_db():
        async with TestSession() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()