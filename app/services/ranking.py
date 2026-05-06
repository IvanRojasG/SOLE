from datetime import date
from decimal import Decimal
from uuid import UUID

from sqlalchemy import case
from sqlmodel import Session, func, select

from app.models.all_models import Achievement, Athlete, Challenge


POWER_LIFTING_CATEGORY = "power_lifting"


def challenge_is_closed(challenge: Challenge, today: date | None = None) -> bool:
    reference_date = today or date.today()
    return reference_date > challenge.end_date


def achievement_result_sort_key(challenge: Challenge, achievement: Achievement) -> tuple[int, int, int, int, str]:
    tie_break_order = achievement.tie_break_order if achievement.tie_break_order is not None else 999_999
    if challenge.category == POWER_LIFTING_CATEGORY:
        return (
            0,
            -(achievement.reps_completed or 0),
            -int(achievement.weight_lbs or Decimal("0")),
            tie_break_order,
            str(achievement.athlete_id),
        )

    if achievement.completed:
        return (
            0,
            achievement.time_seconds if achievement.time_seconds is not None else 999_999,
            0,
            tie_break_order,
            str(achievement.athlete_id),
        )

    return (
        1,
        -(achievement.reps_completed or 0),
        0,
        tie_break_order,
        str(achievement.athlete_id),
    )


def get_best_attempts_by_athlete(
    session: Session,
    challenge: Challenge,
    result_format: str | None = None,
) -> dict[UUID, Achievement]:
    statement = select(Achievement).where(
        Achievement.challenge_id == challenge.id,
        Achievement.status == "approved",
    )
    if result_format:
        statement = statement.where(Achievement.result_format == result_format)

    best_attempts: dict[UUID, Achievement] = {}
    for achievement in session.exec(statement).all():
        current = best_attempts.get(achievement.athlete_id)
        if current is None or achievement_result_sort_key(challenge, achievement) < achievement_result_sort_key(
            challenge,
            current,
        ):
            best_attempts[achievement.athlete_id] = achievement

    return best_attempts


def get_approved_attempt_counts_by_athlete(session: Session, challenge: Challenge) -> dict[UUID, int]:
    rows = session.exec(
        select(Achievement.athlete_id, func.count(Achievement.id))
        .where(
            Achievement.challenge_id == challenge.id,
            Achievement.status == "approved",
        )
        .group_by(Achievement.athlete_id)
    ).all()
    return {athlete_id: int(count) for athlete_id, count in rows}


def get_active_challenge(session: Session) -> Challenge | None:
    today = date.today()
    current = session.exec(
        select(Challenge)
        .where(
            Challenge.is_active == True,  # noqa: E712
            Challenge.start_date <= today,
            Challenge.end_date >= today,
        )
        .order_by(Challenge.start_date.desc())
    ).first()
    if current:
        return current

    return session.exec(
        select(Challenge)
        .where(Challenge.is_active == True)  # noqa: E712
        .order_by(Challenge.end_date.desc())
    ).first()


def get_challenge_wod_ranking(session: Session, challenge_id: UUID | None = None):
    challenge = session.get(Challenge, challenge_id) if challenge_id else get_active_challenge(session)
    athletes = session.exec(select(Athlete).order_by(Athlete.full_name.asc())).all()
    if not challenge:
        return [
            {
                "athlete_id": athlete.id,
                "athlete_name": athlete.full_name,
                "points": 0,
                "result_format": athlete.level if athlete.level in {"rx", "scaled"} else "scaled",
                "approved_achievements": 0,
                "challenge_id": None,
                "challenge_title": None,
                "challenge_end_date": None,
                "completed": False,
                "time_seconds": None,
                "reps_completed": None,
                "is_finalized": False,
                "ranking_view": "challenge",
                "wods_scored": 0,
            }
            for athlete in athletes
        ]

    finalized = challenge_is_closed(challenge)
    best_attempts = get_best_attempts_by_athlete(session, challenge)
    attempt_counts = get_approved_attempt_counts_by_athlete(session, challenge)

    rows = []
    for athlete in athletes:
        best_attempt = best_attempts.get(athlete.id)
        rows.append(
            {
                "athlete_id": athlete.id,
                "athlete_name": athlete.full_name,
                "points": best_attempt.rank_points if finalized and best_attempt and best_attempt.rank_points else 0,
                "result_format": best_attempt.result_format
                if best_attempt
                else athlete.level
                if athlete.level in {"rx", "scaled"}
                else "scaled",
                "approved_achievements": attempt_counts.get(athlete.id, 0),
                "challenge_id": challenge.id,
                "challenge_title": challenge.title,
                "challenge_end_date": challenge.end_date,
                "completed": best_attempt.completed if best_attempt else False,
                "time_seconds": best_attempt.time_seconds if best_attempt else None,
                "reps_completed": best_attempt.reps_completed if best_attempt else None,
                "is_finalized": finalized,
                "ranking_view": "challenge",
                "wods_scored": 1 if best_attempt and best_attempt.rank_points is not None else 0,
                "_sort_key": achievement_result_sort_key(challenge, best_attempt)
                if best_attempt
                else (2, 0, 0, 999_999, athlete.full_name.lower()),
            }
        )

    rows.sort(key=lambda row: (row["_sort_key"], row["athlete_name"].lower()))
    for row in rows:
        row.pop("_sort_key", None)
    return rows


def get_active_wod_ranking(session: Session):
    return get_challenge_wod_ranking(session)


def finalize_challenge_rank_points(session: Session, challenge: Challenge) -> dict[str, int]:
    approved = session.exec(
        select(Achievement).where(
            Achievement.challenge_id == challenge.id,
            Achievement.status == "approved",
        )
    ).all()
    for achievement in approved:
        achievement.rank_points = None
        session.add(achievement)

    if not challenge_is_closed(challenge):
        return {"cleared": len(approved), "ranked": 0}

    ranked = 0
    result_formats = sorted({achievement.result_format for achievement in approved})
    for result_format in result_formats:
        best_attempts = list(get_best_attempts_by_athlete(session, challenge, result_format).values())
        best_attempts.sort(key=lambda achievement: achievement_result_sort_key(challenge, achievement))
        for points, achievement in enumerate(best_attempts, start=1):
            achievement.rank_points = points
            session.add(achievement)
            ranked += 1

    return {"cleared": len(approved), "ranked": ranked}


def get_final_points_ranking(session: Session):
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


def get_event_ranking(session: Session):
    points_sum = func.coalesce(func.sum(Achievement.rank_points), 0)
    approved_count = func.count(Achievement.id)
    wods_scored = func.count(func.distinct(Achievement.challenge_id))
    zero_points_bucket = case((points_sum == 0, 1), else_=0)
    statement = (
        select(
            Athlete.id,
            Athlete.full_name,
            points_sum.label("points"),
            approved_count.label("approved_achievements"),
            wods_scored.label("wods_scored"),
        )
        .select_from(Athlete)
        .outerjoin(
            Achievement,
            (Achievement.athlete_id == Athlete.id)
            & (Achievement.status == "approved")
            & Achievement.rank_points.is_not(None),
        )
        .group_by(Athlete.id, Athlete.full_name)
        .order_by(zero_points_bucket.asc(), points_sum.asc(), Athlete.full_name.asc())
    )

    return [
        {
            "athlete_id": row[0],
            "athlete_name": row[1],
            "points": row[2],
            "result_format": "mixed",
            "approved_achievements": row[3],
            "challenge_id": None,
            "challenge_title": "Total evento",
            "challenge_end_date": None,
            "completed": False,
            "time_seconds": None,
            "reps_completed": None,
            "is_finalized": True,
            "ranking_view": "event",
            "wods_scored": row[4],
        }
        for row in session.exec(statement).all()
    ]


def get_ranking(session: Session):
    return get_event_ranking(session)
