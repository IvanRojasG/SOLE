from datetime import date

from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.models.all_models import Achievement, Athlete, Challenge
from app.schemas.achievement import AchievementCreate, AchievementResultUpdate


WOD_RANK_SOURCE_TYPE = "wod_rank"
METCON_CATEGORY = "custom_metcon_reps"
POWER_LIFTING_CATEGORY = "power_lifting"


def _apply_result(achievement: Achievement, payload: AchievementCreate | AchievementResultUpdate) -> None:
    achievement.completed = payload.completed
    achievement.result_format = payload.result_format
    achievement.time_seconds = payload.time_seconds if payload.completed else None
    achievement.reps_completed = payload.reps_completed
    achievement.weight_lbs = payload.weight_lbs


def _ensure_result_is_complete(challenge: Challenge, achievement: Achievement) -> None:
    if achievement.reps_completed is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="WOD result requires reps_completed")
    if achievement.completed and achievement.time_seconds is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Completed WOD requires time_seconds")
    if challenge.category == POWER_LIFTING_CATEGORY and achievement.weight_lbs is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Power Lifting result requires weight_lbs")


def _result_sort_key(challenge: Challenge, achievement: Achievement) -> tuple[int, int, int, str]:
    tie_break_order = achievement.tie_break_order if achievement.tie_break_order is not None else 999_999
    if challenge.category == POWER_LIFTING_CATEGORY:
        return (-(achievement.reps_completed or 0), -int(achievement.weight_lbs or 0), tie_break_order, str(achievement.athlete_id))

    time_sort = achievement.time_seconds if achievement.time_seconds is not None else 999_999
    return (-(achievement.reps_completed or 0), time_sort, tie_break_order, str(achievement.athlete_id))


def recalculate_wod_rank_points(session: Session, challenge_id, result_format: str) -> None:
    challenge = session.get(Challenge, challenge_id)
    if not challenge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found")

    approved = [
        achievement
        for achievement in session.exec(
            select(Achievement).where(
                Achievement.challenge_id == challenge_id,
                Achievement.status == "approved",
                Achievement.result_format == result_format,
            )
        ).all()
    ]
    approved.sort(key=lambda achievement: _result_sort_key(challenge, achievement))

    for index, achievement in enumerate(approved, start=1):
        achievement.rank_points = index
        session.add(achievement)


def submit_achievement(session: Session, athlete: Athlete, payload: AchievementCreate) -> Achievement:
    challenge = session.get(Challenge, payload.challenge_id)
    if not challenge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found")
    if not challenge.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Challenge is not active")
    today = date.today()
    if today < challenge.start_date or today > challenge.end_date:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Challenge is outside its submission window")
    if challenge.category == METCON_CATEGORY and payload.weight_lbs is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Custom Metcon result does not accept weight_lbs")
    if challenge.category == POWER_LIFTING_CATEGORY and payload.weight_lbs is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Power Lifting result requires weight_lbs")

    duplicate = session.exec(
        select(Achievement).where(
            Achievement.athlete_id == athlete.id,
            Achievement.challenge_id == payload.challenge_id,
            Achievement.achievement_date == payload.achievement_date,
        )
    ).first()
    if duplicate:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Duplicate achievement is not allowed")

    achievement = Achievement(
        athlete_id=athlete.id,
        challenge_id=payload.challenge_id,
        achievement_date=payload.achievement_date,
    )
    _apply_result(achievement, payload)
    if achievement.completed:
        achievement.reps_completed = challenge.total_reps
    session.add(achievement)
    session.commit()
    session.refresh(achievement)
    return achievement


def approve_achievement(session: Session, achievement_id, payload: AchievementResultUpdate | None = None) -> Achievement:
    achievement = session.get(Achievement, achievement_id)
    if not achievement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Achievement not found")
    if achievement.status == "approved":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Achievement already approved")
    if achievement.status == "rejected":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Rejected achievement cannot be approved")

    if payload:
        _apply_result(achievement, payload)
    challenge = session.get(Challenge, achievement.challenge_id)
    if not challenge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found")
    if achievement.completed:
        achievement.reps_completed = challenge.total_reps
    _ensure_result_is_complete(challenge, achievement)
    achievement.status = "approved"
    session.add(achievement)
    recalculate_wod_rank_points(session, achievement.challenge_id, achievement.result_format)
    session.commit()
    session.refresh(achievement)
    return achievement


def update_achievement_result(session: Session, achievement_id, payload: AchievementResultUpdate) -> Achievement:
    achievement = session.get(Achievement, achievement_id)
    if not achievement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Achievement not found")

    _apply_result(achievement, payload)
    challenge = session.get(Challenge, achievement.challenge_id)
    if not challenge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found")
    if achievement.completed:
        achievement.reps_completed = challenge.total_reps
    _ensure_result_is_complete(challenge, achievement)
    session.add(achievement)
    if achievement.status == "approved":
        recalculate_wod_rank_points(session, achievement.challenge_id, achievement.result_format)

    session.commit()
    session.refresh(achievement)
    return achievement


def update_achievement_tie_break(session: Session, achievement_id, tie_break_order: int) -> Achievement:
    achievement = session.get(Achievement, achievement_id)
    if not achievement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Achievement not found")
    if achievement.status != "approved":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only approved achievements can be reordered")

    achievement.tie_break_order = tie_break_order
    session.add(achievement)
    recalculate_wod_rank_points(session, achievement.challenge_id, achievement.result_format)
    session.commit()
    session.refresh(achievement)
    return achievement


def reject_achievement(session: Session, achievement_id) -> Achievement:
    achievement = session.get(Achievement, achievement_id)
    if not achievement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Achievement not found")
    if achievement.status == "approved":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Approved achievement cannot be rejected")
    if achievement.status == "rejected":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Achievement already rejected")

    achievement.status = "rejected"
    session.add(achievement)
    session.commit()
    session.refresh(achievement)
    return achievement
