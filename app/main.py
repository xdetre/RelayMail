from fastapi import FastAPI
from app.api.routes.aliases import router as aliases_router
from app.api.routes.users import router as user_router
from app.api.routes.emails import router as emails_router
from app.db.session import engine, Base

app = FastAPI(title="RelayMailAPI")


app.include_router(aliases_router)
app.include_router(user_router)
app.include_router(emails_router)



@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)