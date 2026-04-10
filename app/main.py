from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from app.api.router import api_router
from app.core.db import engine
from app.services.seed import seed_initial_data


@asynccontextmanager
async def lifespan(_: FastAPI):
    with Session(engine) as session:
        seed_initial_data(session)
    yield


app = FastAPI(title="CrossFit Monthly Challenge API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router)


@app.get("/")
def root():
    return {"message": "CrossFit Monthly Challenge API"}
