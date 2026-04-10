from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.deps import get_current_athlete, require_role
from app.models.all_models import Athlete, User
from app.schemas.athlete import AthleteListResponse, AthleteMeResponse, AthleteUpdateRequest


router = APIRouter()


@router.get("/me", response_model=AthleteMeResponse)
def get_me(athlete: Athlete = Depends(get_current_athlete)):
    return athlete


@router.put("/me", response_model=AthleteMeResponse)
def update_me(
    payload: AthleteUpdateRequest,
    athlete: Athlete = Depends(get_current_athlete),
    session: Session = Depends(get_session),
):
    if payload.full_name is not None:
        athlete.full_name = payload.full_name
    if payload.level is not None:
        athlete.level = payload.level

    session.add(athlete)
    session.commit()
    session.refresh(athlete)
    return athlete


@router.get("", response_model=list[AthleteListResponse])
def list_athletes(
    _: User = Depends(require_role("coach")),
    session: Session = Depends(get_session),
):
    athletes = session.exec(select(Athlete).order_by(Athlete.full_name)).all()
    return athletes
