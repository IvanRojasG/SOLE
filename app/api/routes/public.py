from fastapi import APIRouter, Depends
from sqlmodel import Session, func, select

from app.core.db import get_session
from app.models.all_models import Athlete, PointsLedger
from app.schemas.public import PublicAthleteResponse


router = APIRouter()


@router.get("/athletes", response_model=list[PublicAthleteResponse])
def public_athletes(session: Session = Depends(get_session)):
    statement = (
        select(
            Athlete.id,
            Athlete.full_name,
            Athlete.level,
            Athlete.baseline_locked,
            func.coalesce(func.sum(PointsLedger.points), 0).label("points"),
        )
        .select_from(Athlete)
        .join(PointsLedger, PointsLedger.athlete_id == Athlete.id, isouter=True)
        .group_by(Athlete.id, Athlete.full_name, Athlete.level, Athlete.baseline_locked)
        .order_by(func.coalesce(func.sum(PointsLedger.points), 0).desc(), Athlete.full_name.asc())
    )
    rows = session.exec(statement).all()
    return [
        PublicAthleteResponse(
            id=row[0],
            full_name=row[1],
            level=row[2],
            baseline_locked=row[3],
            points=row[4],
        )
        for row in rows
    ]
