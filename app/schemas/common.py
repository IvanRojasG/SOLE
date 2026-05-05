from uuid import UUID

from pydantic import BaseModel


class MessageResponse(BaseModel):
    message: str


class RankingItem(BaseModel):
    athlete_id: UUID
    athlete_name: str
    points: int
    result_format: str


class DashboardResponse(BaseModel):
    total_athletes: int
    total_coaches: int
    pending_achievements: int
    approved_achievements: int
    ranking_preview: list[RankingItem]
