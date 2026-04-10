from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.core.db import get_session
from app.models.all_models import MovementCatalog, SkillCatalog
from app.schemas.catalog import CatalogItemResponse


router = APIRouter()


@router.get("/movements", response_model=list[CatalogItemResponse])
def list_movements(session: Session = Depends(get_session)):
    return session.exec(select(MovementCatalog).order_by(MovementCatalog.name)).all()


@router.get("/skills", response_model=list[CatalogItemResponse])
def list_skills(session: Session = Depends(get_session)):
    return session.exec(select(SkillCatalog).order_by(SkillCatalog.name)).all()
