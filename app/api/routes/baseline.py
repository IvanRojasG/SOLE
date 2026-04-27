from uuid import UUID

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.deps import get_current_athlete, get_current_coach, require_role
from app.models.all_models import (
    Athlete,
    AthleteBaselineEntry,
    AthleteBaselinePR,
    AthleteBaselineSkill,
    BaselineCatalogItem,
    Coach,
    MovementCatalog,
    SkillCatalog,
    User,
)
from app.schemas.baseline import (
    BaselineCatalogItemCreate,
    BaselineCatalogItemResponse,
    BaselineDetailedResponse,
    BaselineEntryDetailedResponse,
    BaselineEntryResponse,
    BaselineEntryUpsert,
    BaselineMeResponse,
    BaselinePRCreate,
    BaselinePRDetailedResponse,
    BaselinePRResponse,
    BaselineSkillCreate,
    BaselineSkillDetailedResponse,
    BaselineSkillResponse,
)
from app.schemas.common import MessageResponse
from app.services.baseline import (
    create_catalog_item,
    create_pr,
    create_skill,
    lock_baseline,
    update_pr,
    update_skill,
    upsert_entry,
)


router = APIRouter()


@router.get("/catalog", response_model=list[BaselineCatalogItemResponse])
def list_baseline_catalog(session: Session = Depends(get_session)):
    return session.exec(
        select(BaselineCatalogItem)
        .where(BaselineCatalogItem.is_active == True)  # noqa: E712
        .order_by(BaselineCatalogItem.category, BaselineCatalogItem.name)
    ).all()


@router.post("/catalog", response_model=BaselineCatalogItemResponse)
def add_baseline_catalog_item(
    payload: BaselineCatalogItemCreate,
    coach: Coach = Depends(get_current_coach),
    session: Session = Depends(get_session),
):
    return create_catalog_item(session, coach, payload)


@router.post("/entries", response_model=BaselineEntryResponse)
def save_baseline_entry(
    payload: BaselineEntryUpsert,
    athlete: Athlete = Depends(get_current_athlete),
    session: Session = Depends(get_session),
):
    return upsert_entry(session, athlete, payload)


@router.post("/prs", response_model=BaselinePRResponse)
def add_pr(
    payload: BaselinePRCreate,
    athlete: Athlete = Depends(get_current_athlete),
    session: Session = Depends(get_session),
):
    return create_pr(session, athlete, payload)


@router.post("/skills", response_model=BaselineSkillResponse)
def add_skill(
    payload: BaselineSkillCreate,
    athlete: Athlete = Depends(get_current_athlete),
    session: Session = Depends(get_session),
):
    return create_skill(session, athlete, payload)


@router.post("/lock/{athlete_id}", response_model=MessageResponse)
def lock_athlete_baseline(
    athlete_id: UUID,
    _: User = Depends(require_role("coach")),
    session: Session = Depends(get_session),
):
    lock_baseline(session, athlete_id)
    return MessageResponse(message="Baseline locked")


@router.post("/lock/me", response_model=MessageResponse)
def lock_my_baseline(
    athlete: Athlete = Depends(get_current_athlete),
    session: Session = Depends(get_session),
):
    lock_baseline(session, athlete.id)
    return MessageResponse(message="Baseline locked")


@router.put("/prs/{pr_id}", response_model=BaselinePRResponse)
def edit_pr(
    pr_id: UUID,
    payload: BaselinePRCreate,
    athlete: Athlete = Depends(get_current_athlete),
    session: Session = Depends(get_session),
):
    return update_pr(session, athlete, pr_id, payload)


@router.put("/skills/{skill_id}", response_model=BaselineSkillResponse)
def edit_skill(
    skill_id: UUID,
    payload: BaselineSkillCreate,
    athlete: Athlete = Depends(get_current_athlete),
    session: Session = Depends(get_session),
):
    return update_skill(session, athlete, skill_id, payload)


@router.get("/me", response_model=BaselineMeResponse)
def my_baseline(
    athlete: Athlete = Depends(get_current_athlete),
    session: Session = Depends(get_session),
):
    prs = session.exec(select(AthleteBaselinePR).where(AthleteBaselinePR.athlete_id == athlete.id)).all()
    skills = session.exec(
        select(AthleteBaselineSkill).where(AthleteBaselineSkill.athlete_id == athlete.id)
    ).all()
    return BaselineMeResponse(
        baseline_locked=athlete.baseline_locked,
        prs=[BaselinePRResponse(id=pr.id, movement_id=pr.movement_id, weight=pr.weight) for pr in prs],
        skills=[
            BaselineSkillResponse(id=skill.id, skill_id=skill.skill_id, status=skill.status) for skill in skills
        ],
    )


@router.get("/me/detailed", response_model=BaselineDetailedResponse)
def my_baseline_detailed(
    athlete: Athlete = Depends(get_current_athlete),
    session: Session = Depends(get_session),
):
    prs = session.exec(select(AthleteBaselinePR).where(AthleteBaselinePR.athlete_id == athlete.id)).all()
    skills = session.exec(
        select(AthleteBaselineSkill).where(AthleteBaselineSkill.athlete_id == athlete.id)
    ).all()

    movement_map = {
        movement.id: movement.name for movement in session.exec(select(MovementCatalog)).all()
    }
    skill_map = {skill.id: skill.name for skill in session.exec(select(SkillCatalog)).all()}
    entries = session.exec(
        select(AthleteBaselineEntry).where(AthleteBaselineEntry.athlete_id == athlete.id)
    ).all()
    entry_map = {entry.item_id: entry for entry in entries}
    catalog_items = session.exec(
        select(BaselineCatalogItem)
        .where(BaselineCatalogItem.is_active == True)  # noqa: E712
        .order_by(BaselineCatalogItem.category, BaselineCatalogItem.name)
    ).all()

    return BaselineDetailedResponse(
        athlete_id=athlete.id,
        baseline_locked=athlete.baseline_locked,
        prs=[
            BaselinePRDetailedResponse(
                id=pr.id,
                movement_id=pr.movement_id,
                movement_name=movement_map.get(pr.movement_id, "Unknown movement"),
                weight=pr.weight,
            )
            for pr in prs
        ],
        skills=[
            BaselineSkillDetailedResponse(
                id=skill.id,
                skill_id=skill.skill_id,
                skill_name=skill_map.get(skill.skill_id, "Unknown skill"),
                status=skill.status,
            )
            for skill in skills
        ],
        entries=[
            BaselineEntryDetailedResponse(
                id=entry_map[item.id].id if item.id in entry_map else None,
                item_id=item.id,
                name=item.name,
                category=item.category,
                metric_type=item.metric_type,
                unit=item.unit,
                description=item.description,
                value_number=entry_map[item.id].value_number if item.id in entry_map else None,
                status=entry_map[item.id].status if item.id in entry_map else None,
                notes=entry_map[item.id].notes if item.id in entry_map else "",
            )
            for item in catalog_items
        ],
    )
