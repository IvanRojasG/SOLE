from typing import Literal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.core.db import get_session
from app.models.all_models import Challenge
from app.schemas.common import RankingItem
from app.services.ranking import get_challenge_wod_ranking, get_event_ranking


router = APIRouter()


@router.get("", response_model=list[RankingItem])
def ranking(
    view: Literal["event", "challenge"] = "event",
    challenge_id: UUID | None = None,
    session: Session = Depends(get_session),
):
    if view == "challenge":
        if challenge_id and not session.get(Challenge, challenge_id):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found")
        return [RankingItem(**row) for row in get_challenge_wod_ranking(session, challenge_id)]
    return [RankingItem(**row) for row in get_event_ranking(session)]
