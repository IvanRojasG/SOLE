from fastapi import APIRouter, Depends
from sqlmodel import Session, func, select

from app.core.db import get_session
from app.models.all_models import Achievement, Athlete, Coach
from app.schemas.common import DashboardResponse, RankingItem
from app.services.ranking import get_final_points_ranking


router = APIRouter()


@router.get("", response_model=DashboardResponse)
def dashboard(session: Session = Depends(get_session)):
    total_athletes = len(session.exec(select(Athlete.id)).all())
    total_coaches = len(session.exec(select(Coach.id)).all())
    pending = session.exec(select(func.count()).select_from(Achievement).where(Achievement.status == "submitted")).one()
    approved = session.exec(select(func.count()).select_from(Achievement).where(Achievement.status == "approved")).one()
    ranking_rows = get_final_points_ranking(session)[:10]
    return DashboardResponse(
        total_athletes=total_athletes,
        total_coaches=total_coaches,
        pending_achievements=pending,
        approved_achievements=approved,
        ranking_preview=[
            RankingItem(
                athlete_id=row[0],
                athlete_name=row[1],
                points=row[2],
                result_format=row[3],
                approved_achievements=row[4],
            )
            for row in ranking_rows
        ],
    )
