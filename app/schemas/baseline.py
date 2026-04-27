from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class BaselinePRCreate(BaseModel):
    movement_id: UUID
    weight: Decimal = Field(gt=0)


class BaselineSkillCreate(BaseModel):
    skill_id: UUID
    status: str = Field(min_length=2, max_length=20)


class BaselineCatalogItemCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    category: str = Field(min_length=2, max_length=30)
    metric_type: str = Field(min_length=2, max_length=20)
    unit: str = Field(min_length=1, max_length=20)
    description: str = Field(default="", max_length=500)
    is_active: bool = True


class BaselineEntryUpsert(BaseModel):
    item_id: UUID
    value_number: Decimal | None = Field(default=None, gt=0)
    status: str | None = Field(default=None, min_length=2, max_length=20)
    notes: str = Field(default="", max_length=300)


class BaselinePRResponse(BaseModel):
    id: UUID
    movement_id: UUID
    weight: Decimal


class BaselineSkillResponse(BaseModel):
    id: UUID
    skill_id: UUID
    status: str


class BaselineCatalogItemResponse(BaseModel):
    id: UUID
    name: str
    category: str
    metric_type: str
    unit: str
    description: str
    is_active: bool


class BaselineEntryResponse(BaseModel):
    id: UUID
    item_id: UUID
    value_number: Decimal | None
    status: str | None
    notes: str


class BaselineMeResponse(BaseModel):
    baseline_locked: bool
    prs: list[BaselinePRResponse]
    skills: list[BaselineSkillResponse]


class BaselinePRDetailedResponse(BaseModel):
    id: UUID
    movement_id: UUID
    movement_name: str
    weight: Decimal


class BaselineSkillDetailedResponse(BaseModel):
    id: UUID
    skill_id: UUID
    skill_name: str
    status: str


class BaselineEntryDetailedResponse(BaseModel):
    id: UUID | None
    item_id: UUID
    name: str
    category: str
    metric_type: str
    unit: str
    description: str
    value_number: Decimal | None
    status: str | None
    notes: str


class BaselineDetailedResponse(BaseModel):
    athlete_id: UUID
    baseline_locked: bool
    prs: list[BaselinePRDetailedResponse]
    skills: list[BaselineSkillDetailedResponse]
    entries: list[BaselineEntryDetailedResponse] = []
