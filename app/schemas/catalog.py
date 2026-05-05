from uuid import UUID

from pydantic import BaseModel, Field
from datetime import date


class CatalogItemResponse(BaseModel):
    id: UUID
    name: str


class ChallengeResponse(BaseModel):
    id: UUID
    title: str
    category: str
    summary: str
    start_date: date
    end_date: date
    total_reps: int
    youtube_url: str
    is_active: bool


class ChallengeUpsertRequest(BaseModel):
    title: str = Field(min_length=3, max_length=120)
    category: str = Field(min_length=3, max_length=30)
    summary: str = Field(min_length=3, max_length=500)
    start_date: date
    end_date: date
    total_reps: int = Field(ge=0)
    youtube_url: str = Field(default="", max_length=300)
    is_active: bool = True
