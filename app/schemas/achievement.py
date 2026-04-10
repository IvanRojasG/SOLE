from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel


class AchievementCreate(BaseModel):
    challenge_id: UUID
    achievement_date: date


class AchievementResponse(BaseModel):
    id: UUID
    athlete_id: UUID
    challenge_id: UUID
    achievement_date: date
    status: str
    created_at: datetime


class AchievementDetailedResponse(BaseModel):
    id: UUID
    athlete_id: UUID
    athlete_name: str
    challenge_id: UUID
    challenge_title: str
    achievement_date: date
    status: str
    created_at: datetime
    points_awarded: int
