from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class BaselinePRCreate(BaseModel):
    movement_id: UUID
    weight: Decimal = Field(gt=0)


class BaselineSkillCreate(BaseModel):
    skill_id: UUID
    status: str = Field(min_length=2, max_length=20)


class BaselinePRResponse(BaseModel):
    id: UUID
    movement_id: UUID
    weight: Decimal


class BaselineSkillResponse(BaseModel):
    id: UUID
    skill_id: UUID
    status: str


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


class BaselineDetailedResponse(BaseModel):
    athlete_id: UUID
    baseline_locked: bool
    prs: list[BaselinePRDetailedResponse]
    skills: list[BaselineSkillDetailedResponse]
