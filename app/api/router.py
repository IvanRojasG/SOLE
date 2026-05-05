from fastapi import APIRouter

from app.api.routes import (
    achievements,
    athletes,
    auth,
    baseline,
    catalogs,
    challenges,
    dashboard,
    public,
    ranking,
)


api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(athletes.router, prefix="/athletes", tags=["athletes"])
api_router.include_router(baseline.router, prefix="/baseline", tags=["baseline"])
api_router.include_router(achievements.router, prefix="/achievements", tags=["achievements"])
api_router.include_router(challenges.router, prefix="/challenges", tags=["challenges"])
api_router.include_router(catalogs.router, prefix="/catalogs", tags=["catalogs"])
api_router.include_router(public.router, prefix="/public", tags=["public"])
api_router.include_router(ranking.router, prefix="/ranking", tags=["ranking"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
