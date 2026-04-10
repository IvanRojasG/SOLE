from datetime import datetime
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
