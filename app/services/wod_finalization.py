import asyncio
from datetime import date
from uuid import UUID

from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.core.db import engine
from app.models.all_models import Challenge
from app.services.ranking import challenge_is_closed, finalize_challenge_rank_points


WOD_FINALIZATION_INTERVAL_SECONDS = 60 * 60


def finalize_all_challenge_rankings(session: Session) -> dict[str, int]:
    challenges = session.exec(select(Challenge).order_by(Challenge.end_date.asc())).all()
    cleared = 0
    ranked = 0
    finalized = 0

    for challenge in challenges:
        result = finalize_challenge_rank_points(session, challenge)
        cleared += result["cleared"]
        ranked += result["ranked"]
        if challenge_is_closed(challenge):
            finalized += 1

    return {
        "challenges": len(challenges),
        "finalized": finalized,
        "cleared": cleared,
        "ranked": ranked,
    }


def finalize_challenge_for_coach(session: Session, challenge_id: UUID) -> dict[str, object]:
    challenge = session.get(Challenge, challenge_id)
    if not challenge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found")

    if not challenge_is_closed(challenge, date.today()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Solo disponible después de la fecha de cierre",
        )

    result = finalize_challenge_rank_points(session, challenge)
    session.commit()
    return {
        "message": "Ranking recalculado",
        "challenge_id": challenge.id,
        "cleared": result["cleared"],
        "ranked": result["ranked"],
        "is_finalized": True,
    }


def recalculate_challenge_after_result_change(session: Session, challenge: Challenge) -> None:
    finalize_challenge_rank_points(session, challenge)


async def run_periodic_wod_finalization() -> None:
    while True:
        await asyncio.sleep(WOD_FINALIZATION_INTERVAL_SECONDS)
        with Session(engine) as session:
            finalize_all_challenge_rankings(session)
            session.commit()
