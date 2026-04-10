from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.models.all_models import Achievement, Athlete, Challenge, PointsLedger
from app.schemas.achievement import AchievementCreate


def submit_achievement(session: Session, athlete: Athlete, payload: AchievementCreate) -> Achievement:
    challenge = session.get(Challenge, payload.challenge_id)
    if not challenge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found")

    duplicate = session.exec(
        select(Achievement).where(
            Achievement.athlete_id == athlete.id,
            Achievement.challenge_id == payload.challenge_id,
            Achievement.achievement_date == payload.achievement_date,
        )
    ).first()
    if duplicate:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Duplicate achievement is not allowed")

    achievement = Achievement(
        athlete_id=athlete.id,
        challenge_id=payload.challenge_id,
        achievement_date=payload.achievement_date,
    )
    session.add(achievement)
    session.commit()
    session.refresh(achievement)
    return achievement


def approve_achievement(session: Session, achievement_id) -> Achievement:
    achievement = session.get(Achievement, achievement_id)
    if not achievement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Achievement not found")
    if achievement.status == "approved":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Achievement already approved")
    if achievement.status == "rejected":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Rejected achievement cannot be approved")

    challenge = session.get(Challenge, achievement.challenge_id)
    achievement.status = "approved"
    session.add(achievement)

    ledger = PointsLedger(
        athlete_id=achievement.athlete_id,
        source_type="achievement",
        source_id=achievement.id,
        points=challenge.points,
    )
    session.add(ledger)
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
