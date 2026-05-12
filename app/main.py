import asyncio
from contextlib import asynccontextmanager
from contextlib import suppress

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from app.api.router import api_router
from app.core.db import engine
from app.services.seed import seed_initial_data
from app.services.wod_finalization import finalize_all_challenge_rankings, run_periodic_wod_finalization


@asynccontextmanager
async def lifespan(_: FastAPI):
    with Session(engine) as session:
        seed_initial_data(session)
        finalize_all_challenge_rankings(session)
        session.commit()

    finalization_task = asyncio.create_task(run_periodic_wod_finalization())
    try:
        yield
    finally:
        finalization_task.cancel()
        with suppress(asyncio.CancelledError):
            await finalization_task


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
