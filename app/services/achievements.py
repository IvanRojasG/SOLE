from datetime import date

from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.models.all_models import Achievement, Athlete, Challenge
from app.schemas.achievement import AchievementCreate, AchievementResultUpdate
from app.services.ranking import finalize_challenge_rank_points
from app.services.wod_finalization import recalculate_challenge_after_result_change


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


def recalculate_wod_rank_points(session: Session, challenge_id, result_format: str) -> None:
    challenge = session.get(Challenge, challenge_id)
    if not challenge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found")
    finalize_challenge_rank_points(session, challenge)


def submit_achievement(
    session: Session,
    athlete: Athlete,
    payload: AchievementCreate,
    *,
    allow_outside_window: bool = False,
) -> Achievement:
    challenge = session.get(Challenge, payload.challenge_id)
    if not challenge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found")
    if not challenge.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Challenge is not active")
    today = date.today()
    if today < challenge.start_date or (today > challenge.end_date and not allow_outside_window):
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
    achievement.rank_points = None
    session.add(achievement)
    recalculate_challenge_after_result_change(session, challenge)
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
    achievement.rank_points = None
    session.add(achievement)
    recalculate_challenge_after_result_change(session, challenge)

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
    achievement.rank_points = None
    session.add(achievement)
    challenge = session.get(Challenge, achievement.challenge_id)
    if not challenge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found")
    recalculate_challenge_after_result_change(session, challenge)
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
