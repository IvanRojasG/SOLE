from fastapi import APIRouter, Depends
from sqlmodel import Session, func, select

from app.core.db import get_session
from app.core.deps import get_current_athlete, require_role
from app.models.all_models import Achievement, Athlete, User
from app.schemas.athlete import AthleteListResponse, AthleteMeResponse, AthleteUpdateRequest
from app.services.ranking import get_ranking


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
    points_by_athlete: dict[str, int] = {}
    for row in get_ranking(session):
        points_by_athlete[str(row[0])] = points_by_athlete.get(str(row[0]), 0) + int(row[2])
    achievement_rows = session.exec(
        select(Achievement.athlete_id, func.count(Achievement.id))
        .where(Achievement.status == "approved")
        .group_by(Achievement.athlete_id)
    ).all()
    approved_by_athlete = {athlete_id: int(count) for athlete_id, count in achievement_rows}

    return [
        AthleteListResponse(
            id=athlete.id,
            full_name=athlete.full_name,
            level=athlete.level,
            baseline_locked=athlete.baseline_locked,
            points=points_by_athlete.get(str(athlete.id), 0),
            approved_achievements=approved_by_athlete.get(athlete.id, 0),
        )
        for athlete in athletes
    ]
