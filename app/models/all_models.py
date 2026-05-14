from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel, UniqueConstraint


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(index=True, unique=True, max_length=120)
    password_hash: str = Field(max_length=255)
    role: str = Field(max_length=20)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class PasswordResetToken(SQLModel, table=True):
    __tablename__ = "password_reset_tokens"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", nullable=False, index=True)
    token_hash: str = Field(max_length=64, unique=True, index=True)
    expires_at: datetime = Field(nullable=False)
    used_at: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class Athlete(SQLModel, table=True):
    __tablename__ = "athletes"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", unique=True, nullable=False)
    full_name: str = Field(max_length=150)
    level: str = Field(max_length=20)
    baseline_locked: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class Coach(SQLModel, table=True):
    __tablename__ = "coaches"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", unique=True, nullable=False)
    full_name: str = Field(max_length=150)


class MovementCatalog(SQLModel, table=True):
    __tablename__ = "movement_catalog"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(unique=True, max_length=80)


class SkillCatalog(SQLModel, table=True):
    __tablename__ = "skill_catalog"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(unique=True, max_length=80)


class BaselineCatalogItem(SQLModel, table=True):
    __tablename__ = "baseline_catalog_items"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(unique=True, max_length=120)
    category: str = Field(max_length=30)
    metric_type: str = Field(max_length=20)
    unit: str = Field(max_length=20)
    description: str = Field(default="", max_length=500)
    is_active: bool = Field(default=True)
    created_by: Optional[UUID] = Field(default=None, foreign_key="coaches.id")


class AthleteBaselinePR(SQLModel, table=True):
    __tablename__ = "athlete_baseline_prs"
    __table_args__ = (UniqueConstraint("athlete_id", "movement_id", name="uq_athlete_baseline_prs"),)

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    athlete_id: UUID = Field(foreign_key="athletes.id", nullable=False)
    movement_id: UUID = Field(foreign_key="movement_catalog.id", nullable=False)
    weight: Decimal


class AthleteBaselineSkill(SQLModel, table=True):
    __tablename__ = "athlete_baseline_skills"
    __table_args__ = (UniqueConstraint("athlete_id", "skill_id", name="uq_athlete_baseline_skills"),)

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    athlete_id: UUID = Field(foreign_key="athletes.id", nullable=False)
    skill_id: UUID = Field(foreign_key="skill_catalog.id", nullable=False)
    status: str = Field(max_length=20)


class AthleteBaselineEntry(SQLModel, table=True):
    __tablename__ = "athlete_baseline_entries"
    __table_args__ = (UniqueConstraint("athlete_id", "item_id", name="uq_athlete_baseline_entries"),)

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    athlete_id: UUID = Field(foreign_key="athletes.id", nullable=False)
    item_id: UUID = Field(foreign_key="baseline_catalog_items.id", nullable=False)
    value_number: Optional[Decimal] = Field(default=None)
    status: Optional[str] = Field(default=None, max_length=20)
    notes: str = Field(default="", max_length=300)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class Challenge(SQLModel, table=True):
    __tablename__ = "challenges"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str = Field(max_length=120, unique=True)
    category: str = Field(max_length=30, default="consistency")
    summary: str = Field(max_length=500, default="")
    start_date: date
    end_date: date
    total_reps: int = Field(default=0)
    scoring_type: str = Field(default="for_time", max_length=20)
    youtube_url: str = Field(default="", max_length=300)
    is_active: bool = Field(default=True)


class Achievement(SQLModel, table=True):
    __tablename__ = "achievements"
    __table_args__ = (
        UniqueConstraint("athlete_id", "challenge_id", "achievement_date", name="uq_achievement_duplicate"),
    )

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    athlete_id: UUID = Field(foreign_key="athletes.id", nullable=False)
    challenge_id: UUID = Field(foreign_key="challenges.id", nullable=False)
    achievement_date: date
    status: str = Field(default="submitted", max_length=20)
    completed: bool = Field(default=False)
    result_format: str = Field(default="scaled", max_length=20)
    time_seconds: Optional[int] = Field(default=None)
    reps_completed: Optional[int] = Field(default=None)
    weight_lbs: Optional[Decimal] = Field(default=None)
    tie_break_order: Optional[int] = Field(default=None)
    rank_points: Optional[int] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class PointsLedger(SQLModel, table=True):
    __tablename__ = "points_ledger"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    athlete_id: UUID = Field(foreign_key="athletes.id", nullable=False)
    source_type: str = Field(max_length=30)
    source_id: Optional[UUID] = Field(default=None)
    points: int
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
