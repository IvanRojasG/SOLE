from sqlalchemy import case
from sqlmodel import Session, func, select

from app.models.all_models import Achievement, Athlete


def get_ranking(session: Session):
    points_sum = func.coalesce(func.sum(Achievement.rank_points), 0)
    approved_count = func.count(Achievement.id)
    result_format = func.coalesce(Achievement.result_format, "scaled")
    zero_points_bucket = case((points_sum == 0, 1), else_=0)
    statement = (
        select(
            Athlete.id,
            Athlete.full_name,
            points_sum.label("points"),
            result_format.label("result_format"),
            approved_count.label("approved_achievements"),
        )
        .select_from(Athlete)
        .outerjoin(
            Achievement,
            (Achievement.athlete_id == Athlete.id)
            & (Achievement.status == "approved")
            & Achievement.rank_points.is_not(None),
        )
        .group_by(Athlete.id, Athlete.full_name, result_format)
        .order_by(zero_points_bucket.asc(), points_sum.asc(), Athlete.full_name.asc())
    )
    return session.exec(statement).all()
