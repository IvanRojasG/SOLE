from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class AthleteMeResponse(BaseModel):
    id: UUID
    user_id: UUID
    full_name: str
    level: str
    baseline_locked: bool
    created_at: datetime


class AthleteUpdateRequest(BaseModel):
    full_name: str | None = Field(default=None, min_length=3, max_length=150)
    level: str | None = Field(default=None, min_length=2, max_length=20)


class AthleteListResponse(BaseModel):
    id: UUID
    full_name: str
    level: str
    baseline_locked: bool
    points: int = 0
    approved_achievements: int = 0


class AthleteScoreAttemptResponse(BaseModel):
    id: UUID
    achievement_date: date
    status: str
    completed: bool
    result_format: str
    time_seconds: int | None
    reps_completed: int | None
    weight_lbs: Decimal | None
    tie_break_order: int | None
    rank_points: int | None
    created_at: datetime
    counts_for_leaderboard: bool


class AthleteScoreChallengeResponse(BaseModel):
    challenge_id: UUID
    challenge_title: str
    challenge_category: str
    challenge_scoring_type: str
    challenge_end_date: date
    is_finalized: bool
    attempts: list[AthleteScoreAttemptResponse]


class AthleteScoresResponse(BaseModel):
    athlete_id: UUID
    athlete_name: str
    level: str
    scores: list[AthleteScoreChallengeResponse]
