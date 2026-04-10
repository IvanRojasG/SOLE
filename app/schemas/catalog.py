from uuid import UUID

from pydantic import BaseModel, Field


class CatalogItemResponse(BaseModel):
    id: UUID
    name: str


class ChallengeResponse(BaseModel):
    id: UUID
    title: str
    category: str
    difficulty: str
    summary: str
    window_label: str
    is_active: bool
    points: int


class ChallengeUpsertRequest(BaseModel):
    title: str = Field(min_length=3, max_length=120)
    category: str = Field(min_length=3, max_length=30)
    difficulty: str = Field(min_length=3, max_length=20)
    summary: str = Field(min_length=3, max_length=500)
    window_label: str = Field(min_length=3, max_length=80)
    is_active: bool = True
    points: int = Field(gt=0)
