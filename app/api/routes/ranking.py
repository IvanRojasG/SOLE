from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.core.db import get_session
from app.schemas.common import RankingItem
from app.services.ranking import get_ranking


router = APIRouter()


@router.get("", response_model=list[RankingItem])
def ranking(session: Session = Depends(get_session)):
    rows = get_ranking(session)
    return [RankingItem(athlete_id=row[0], athlete_name=row[1], points=row[2]) for row in rows]
