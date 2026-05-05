from uuid import UUID

from fastapi import APIRouter, Body, Depends
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.deps import get_current_athlete, require_role
from app.models.all_models import Achievement, Athlete, Challenge, User
from app.schemas.achievement import (
    AchievementCreate,
    AchievementDetailedResponse,
    AchievementResponse,
    AchievementResultUpdate,
    AchievementTieBreakUpdate,
)
from app.schemas.common import MessageResponse
from app.services.achievements import (
    approve_achievement,
    reject_achievement,
    submit_achievement,
    update_achievement_result,
    update_achievement_tie_break,
)


router = APIRouter()


@router.post("", response_model=AchievementResponse)
def create_achievement(
    payload: AchievementCreate,
    athlete: Athlete = Depends(get_current_athlete),
    session: Session = Depends(get_session),
):
    return submit_achievement(session, athlete, payload)


@router.get("/me", response_model=list[AchievementResponse])
def my_achievements(
    athlete: Athlete = Depends(get_current_athlete),
    session: Session = Depends(get_session),
):
    return session.exec(select(Achievement).where(Achievement.athlete_id == athlete.id)).all()


@router.get("/pending", response_model=list[AchievementResponse])
def pending_achievements(
    _: User = Depends(require_role("coach")),
    session: Session = Depends(get_session),
):
    return session.exec(select(Achievement).where(Achievement.status == "submitted")).all()


@router.get("/me/detailed", response_model=list[AchievementDetailedResponse])
def my_achievements_detailed(
    athlete: Athlete = Depends(get_current_athlete),
    session: Session = Depends(get_session),
):
    achievements = session.exec(
        select(Achievement).where(Achievement.athlete_id == athlete.id).order_by(Achievement.achievement_date.desc())
    ).all()
    challenges = {challenge.id: challenge for challenge in session.exec(select(Challenge)).all()}
    return [
        AchievementDetailedResponse(
            id=achievement.id,
            athlete_id=achievement.athlete_id,
            athlete_name=athlete.full_name,
            challenge_id=achievement.challenge_id,
            challenge_title=challenges[achievement.challenge_id].title
            if achievement.challenge_id in challenges
            else "Unknown challenge",
            achievement_date=achievement.achievement_date,
            status=achievement.status,
            created_at=achievement.created_at,
            points_awarded=achievement.rank_points or 0,
            completed=achievement.completed,
            result_format=achievement.result_format,
            time_seconds=achievement.time_seconds,
            reps_completed=achievement.reps_completed,
            weight_lbs=achievement.weight_lbs,
            tie_break_order=achievement.tie_break_order,
            rank_points=achievement.rank_points,
        )
        for achievement in achievements
    ]


@router.get("/pending/detailed", response_model=list[AchievementDetailedResponse])
def pending_achievements_detailed(
    _: User = Depends(require_role("coach")),
    session: Session = Depends(get_session),
):
    achievements = session.exec(
        select(Achievement).where(Achievement.status == "submitted").order_by(Achievement.created_at.desc())
    ).all()
    athletes = {athlete.id: athlete for athlete in session.exec(select(Athlete)).all()}
    challenges = {challenge.id: challenge for challenge in session.exec(select(Challenge)).all()}
    return [
        AchievementDetailedResponse(
            id=achievement.id,
            athlete_id=achievement.athlete_id,
            athlete_name=athletes[achievement.athlete_id].full_name
            if achievement.athlete_id in athletes
            else "Unknown athlete",
            challenge_id=achievement.challenge_id,
            challenge_title=challenges[achievement.challenge_id].title
            if achievement.challenge_id in challenges
            else "Unknown challenge",
            achievement_date=achievement.achievement_date,
            status=achievement.status,
            created_at=achievement.created_at,
            points_awarded=achievement.rank_points or 0,
            completed=achievement.completed,
            result_format=achievement.result_format,
            time_seconds=achievement.time_seconds,
            reps_completed=achievement.reps_completed,
            weight_lbs=achievement.weight_lbs,
            tie_break_order=achievement.tie_break_order,
            rank_points=achievement.rank_points,
        )
        for achievement in achievements
    ]


@router.get("/detailed", response_model=list[AchievementDetailedResponse])
def coach_achievements_detailed(
    _: User = Depends(require_role("coach")),
    session: Session = Depends(get_session),
):
    achievements = session.exec(
        select(Achievement)
        .where(Achievement.status.in_(["submitted", "approved"]))
        .order_by(Achievement.created_at.desc())
    ).all()
    athletes = {athlete.id: athlete for athlete in session.exec(select(Athlete)).all()}
    challenges = {challenge.id: challenge for challenge in session.exec(select(Challenge)).all()}
    return [
        AchievementDetailedResponse(
            id=achievement.id,
            athlete_id=achievement.athlete_id,
            athlete_name=athletes[achievement.athlete_id].full_name
            if achievement.athlete_id in athletes
            else "Unknown athlete",
            challenge_id=achievement.challenge_id,
            challenge_title=challenges[achievement.challenge_id].title
            if achievement.challenge_id in challenges
            else "Unknown challenge",
            achievement_date=achievement.achievement_date,
            status=achievement.status,
            created_at=achievement.created_at,
            points_awarded=achievement.rank_points or 0,
            completed=achievement.completed,
            result_format=achievement.result_format,
            time_seconds=achievement.time_seconds,
            reps_completed=achievement.reps_completed,
            weight_lbs=achievement.weight_lbs,
            tie_break_order=achievement.tie_break_order,
            rank_points=achievement.rank_points,
        )
        for achievement in achievements
    ]


@router.post("/{id}/approve", response_model=MessageResponse)
def approve(
    id: UUID,
    payload: AchievementResultUpdate | None = Body(default=None),
    _: User = Depends(require_role("coach")),
    session: Session = Depends(get_session),
):
    approve_achievement(session, id, payload)
    return MessageResponse(message="Achievement approved")


@router.put("/{id}/result", response_model=AchievementResponse)
def update_result(
    id: UUID,
    payload: AchievementResultUpdate,
    _: User = Depends(require_role("coach")),
    session: Session = Depends(get_session),
):
    return update_achievement_result(session, id, payload)


@router.put("/{id}/tie-break", response_model=AchievementResponse)
def update_tie_break(
    id: UUID,
    payload: AchievementTieBreakUpdate,
    _: User = Depends(require_role("coach")),
    session: Session = Depends(get_session),
):
    return update_achievement_tie_break(session, id, payload.tie_break_order)


@router.post("/{id}/reject", response_model=MessageResponse)
def reject(
    id: UUID,
    _: User = Depends(require_role("coach")),
    session: Session = Depends(get_session),
):
    reject_achievement(session, id)
    return MessageResponse(message="Achievement rejected")
