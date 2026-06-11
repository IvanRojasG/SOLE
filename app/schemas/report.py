from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class ClassifierWodReportRow(BaseModel):
    athlete_id: UUID
    athlete_name: str
    athlete_level: str
    challenge_id: UUID
    challenge_title: str
    challenge_end_date: date
    result_format: str
    score_label: str
    completed: bool
    time_seconds: int | None
    reps_completed: int | None
    weight_lbs: Decimal | None
    tie_break_order: int | None
    rank_points: int
    achievement_date: date


class ClassifierWodReportResponse(BaseModel):
    generated_at: datetime
    total_rows: int
    rows: list[ClassifierWodReportRow]
