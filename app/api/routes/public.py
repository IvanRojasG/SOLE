from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.core.db import get_session
from app.models.all_models import Athlete
from app.schemas.public import PublicAthleteResponse
from app.services.ranking import get_ranking


router = APIRouter()


@router.get("/athletes", response_model=list[PublicAthleteResponse])
def public_athletes(session: Session = Depends(get_session)):
    ranking_points: dict[str, int] = {}
    for row in get_ranking(session):
        ranking_points[str(row[0])] = ranking_points.get(str(row[0]), 0) + int(row[2])
    athletes = session.exec(select(Athlete).order_by(Athlete.full_name.asc())).all()
    return [
        PublicAthleteResponse(
            id=athlete.id,
            full_name=athlete.full_name,
            level=athlete.level,
            baseline_locked=athlete.baseline_locked,
            points=ranking_points.get(str(athlete.id), 0),
        )
        for athlete in athletes
    ]
