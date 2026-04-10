from sqlmodel import Session, func, select

from app.models.all_models import Athlete, PointsLedger


def get_ranking(session: Session):
    statement = (
        select(
            Athlete.id,
            Athlete.full_name,
            func.coalesce(func.sum(PointsLedger.points), 0).label("points"),
        )
        .select_from(Athlete)
        .join(PointsLedger, PointsLedger.athlete_id == Athlete.id, isouter=True)
        .group_by(Athlete.id, Athlete.full_name)
        .order_by(func.coalesce(func.sum(PointsLedger.points), 0).desc(), Athlete.full_name.asc())
    )
    return session.exec(statement).all()
