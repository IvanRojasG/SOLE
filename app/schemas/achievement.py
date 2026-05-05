from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field, model_validator


class AchievementCreate(BaseModel):
    challenge_id: UUID
    achievement_date: date
    completed: bool
    result_format: str = Field(pattern="^(rx|scaled)$")
    time_seconds: int | None = Field(default=None, gt=0)
    reps_completed: int | None = Field(default=None, ge=0)
    weight_lbs: Decimal | None = Field(default=None, gt=0)

    @model_validator(mode="after")
    def validate_result(self):
        if self.completed and self.time_seconds is None:
            raise ValueError("time_seconds is required when completed is true")
        if not self.completed and self.reps_completed is None:
            raise ValueError("reps_completed is required when completed is false")
        return self


class AchievementResultUpdate(BaseModel):
    completed: bool
    result_format: str = Field(pattern="^(rx|scaled)$")
    time_seconds: int | None = Field(default=None, gt=0)
    reps_completed: int | None = Field(default=None, ge=0)
    weight_lbs: Decimal | None = Field(default=None, gt=0)

    @model_validator(mode="after")
    def validate_result(self):
        if self.completed and self.time_seconds is None:
            raise ValueError("time_seconds is required when completed is true")
        if not self.completed and self.reps_completed is None:
            raise ValueError("reps_completed is required when completed is false")
        return self


class AchievementTieBreakUpdate(BaseModel):
    tie_break_order: int = Field(ge=1)


class AchievementResponse(BaseModel):
    id: UUID
    athlete_id: UUID
    challenge_id: UUID
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
    completed: bool
    result_format: str
    time_seconds: int | None
    reps_completed: int | None
    weight_lbs: Decimal | None
    tie_break_order: int | None
    rank_points: int | None
