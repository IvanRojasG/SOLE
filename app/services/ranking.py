from sqlmodel import Session, func, select

from app.models.all_models import Achievement, Athlete, Challenge


def get_ranking(session: Session):
    points_sum = func.coalesce(func.sum(Achievement.rank_points), 0)
    approved_count = func.count(Achievement.id)
    statement = (
        select(
            Athlete.id,
            Athlete.full_name,
            points_sum.label("points"),
            Achievement.result_format,
            approved_count.label("approved_achievements"),
        )
        .select_from(Athlete)
        .join(Achievement, Achievement.athlete_id == Athlete.id)
        .join(Challenge, Challenge.id == Achievement.challenge_id)
        .where(
            Achievement.status == "approved",
            Achievement.rank_points.is_not(None),
        )
        .group_by(Athlete.id, Athlete.full_name, Achievement.result_format)
        .order_by(points_sum.asc(), Athlete.full_name.asc())
    )
    return session.exec(statement).all()
