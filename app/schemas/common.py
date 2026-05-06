from datetime import date
from uuid import UUID

from pydantic import BaseModel


class MessageResponse(BaseModel):
    message: str


class RankingItem(BaseModel):
    athlete_id: UUID
    athlete_name: str
    points: int
    result_format: str
    approved_achievements: int
    challenge_id: UUID | None = None
    challenge_title: str | None = None
    challenge_end_date: date | None = None
    completed: bool = False
    time_seconds: int | None = None
    reps_completed: int | None = None
    is_finalized: bool = False
    ranking_view: str = "event"
    wods_scored: int = 0


class DashboardResponse(BaseModel):
    total_athletes: int
    total_coaches: int
    pending_achievements: int
    approved_achievements: int
    ranking_preview: list[RankingItem]
