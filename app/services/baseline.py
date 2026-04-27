from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.models.all_models import (
    Athlete,
    AthleteBaselineEntry,
    AthleteBaselinePR,
    AthleteBaselineSkill,
    BaselineCatalogItem,
    Coach,
    MovementCatalog,
    SkillCatalog,
)
from app.schemas.baseline import BaselineCatalogItemCreate, BaselineEntryUpsert, BaselinePRCreate, BaselineSkillCreate


NUMERIC_METRIC_TYPES = {"weight", "time", "reps", "distance", "score"}
STATUS_METRIC_TYPES = {"status"}


def ensure_baseline_editable(athlete: Athlete) -> None:
    if athlete.baseline_locked:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Baseline is locked")


def create_catalog_item(
    session: Session,
    coach: Coach,
    payload: BaselineCatalogItemCreate,
) -> BaselineCatalogItem:
    normalized_metric_type = payload.metric_type.strip().lower()
    normalized_category = payload.category.strip().lower()
    normalized_unit = payload.unit.strip().lower()

    if normalized_metric_type not in NUMERIC_METRIC_TYPES | STATUS_METRIC_TYPES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported baseline metric type")

    existing_item = session.exec(
        select(BaselineCatalogItem).where(BaselineCatalogItem.name == payload.name.strip())
    ).first()
    if existing_item:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Baseline catalog item already exists")

    item = BaselineCatalogItem(
        name=payload.name.strip(),
        category=normalized_category,
        metric_type=normalized_metric_type,
        unit=normalized_unit,
        description=payload.description.strip(),
        is_active=payload.is_active,
        created_by=coach.id,
    )
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


def upsert_entry(session: Session, athlete: Athlete, payload: BaselineEntryUpsert) -> AthleteBaselineEntry:
    ensure_baseline_editable(athlete)
    item = session.get(BaselineCatalogItem, payload.item_id)
    if not item or not item.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Baseline item not found")

    if item.metric_type in NUMERIC_METRIC_TYPES and payload.value_number is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Numeric baseline value is required")

    if item.metric_type in STATUS_METRIC_TYPES and not payload.status:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Status baseline value is required")

    entry = session.exec(
        select(AthleteBaselineEntry).where(
            AthleteBaselineEntry.athlete_id == athlete.id,
            AthleteBaselineEntry.item_id == payload.item_id,
        )
    ).first()

    if not entry:
        entry = AthleteBaselineEntry(athlete_id=athlete.id, item_id=payload.item_id)

    entry.value_number = payload.value_number if item.metric_type in NUMERIC_METRIC_TYPES else None
    entry.status = payload.status if item.metric_type in STATUS_METRIC_TYPES else None
    entry.notes = payload.notes.strip()
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return entry


def create_pr(session: Session, athlete: Athlete, payload: BaselinePRCreate) -> AthleteBaselinePR:
    ensure_baseline_editable(athlete)
    movement = session.get(MovementCatalog, payload.movement_id)
    if not movement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movement not found")

    existing_pr = session.exec(
        select(AthleteBaselinePR).where(
            AthleteBaselinePR.athlete_id == athlete.id,
            AthleteBaselinePR.movement_id == payload.movement_id,
        )
    ).first()
    if existing_pr:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="PR already registered")

    pr = AthleteBaselinePR(athlete_id=athlete.id, movement_id=payload.movement_id, weight=payload.weight)
    session.add(pr)
    session.commit()
    session.refresh(pr)
    return pr


def create_skill(session: Session, athlete: Athlete, payload: BaselineSkillCreate) -> AthleteBaselineSkill:
    ensure_baseline_editable(athlete)
    skill = session.get(SkillCatalog, payload.skill_id)
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")

    existing_skill = session.exec(
        select(AthleteBaselineSkill).where(
            AthleteBaselineSkill.athlete_id == athlete.id,
            AthleteBaselineSkill.skill_id == payload.skill_id,
        )
    ).first()
    if existing_skill:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Skill already registered")

    baseline_skill = AthleteBaselineSkill(athlete_id=athlete.id, skill_id=payload.skill_id, status=payload.status)
    session.add(baseline_skill)
    session.commit()
    session.refresh(baseline_skill)
    return baseline_skill


def update_pr(session: Session, athlete: Athlete, pr_id, payload: BaselinePRCreate) -> AthleteBaselinePR:
    ensure_baseline_editable(athlete)
    pr = session.get(AthleteBaselinePR, pr_id)
    if not pr or pr.athlete_id != athlete.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="PR not found")

    movement = session.get(MovementCatalog, payload.movement_id)
    if not movement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movement not found")

    duplicate = session.exec(
        select(AthleteBaselinePR).where(
            AthleteBaselinePR.athlete_id == athlete.id,
            AthleteBaselinePR.movement_id == payload.movement_id,
            AthleteBaselinePR.id != pr_id,
        )
    ).first()
    if duplicate:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="PR already registered for movement")

    pr.movement_id = payload.movement_id
    pr.weight = payload.weight
    session.add(pr)
    session.commit()
    session.refresh(pr)
    return pr


def update_skill(session: Session, athlete: Athlete, skill_id, payload: BaselineSkillCreate) -> AthleteBaselineSkill:
    ensure_baseline_editable(athlete)
    baseline_skill = session.get(AthleteBaselineSkill, skill_id)
    if not baseline_skill or baseline_skill.athlete_id != athlete.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill entry not found")

    skill = session.get(SkillCatalog, payload.skill_id)
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")

    duplicate = session.exec(
        select(AthleteBaselineSkill).where(
            AthleteBaselineSkill.athlete_id == athlete.id,
            AthleteBaselineSkill.skill_id == payload.skill_id,
            AthleteBaselineSkill.id != skill_id,
        )
    ).first()
    if duplicate:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Skill already registered")

    baseline_skill.skill_id = payload.skill_id
    baseline_skill.status = payload.status
    session.add(baseline_skill)
    session.commit()
    session.refresh(baseline_skill)
    return baseline_skill


def lock_baseline(session: Session, athlete_id):
    athlete = session.get(Athlete, athlete_id)
    if not athlete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Athlete not found")
    if athlete.baseline_locked:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Baseline already locked")

    athlete.baseline_locked = True
    session.add(athlete)
    session.commit()
    session.refresh(athlete)
    return athlete
