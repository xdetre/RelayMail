from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.aliases import router as aliases_router
from app.api.routes.users import router as user_router
from app.api.routes.emails import router as emails_router
from app.api.routes.auth import router as auth_router
from app.db.session import engine, Base


app = FastAPI(title="RelayMailAPI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(aliases_router)
app.include_router(user_router)
app.include_router(emails_router)
app.include_router(auth_router)


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)