from fastapi import FastAPI
from app.api.routes.aliases import router as aliases_router
from app.api.routes.users import router as user_router

app = FastAPI(title="RelayMailAPI")


app.include_router(aliases_router)
app.include_router(user_router)

