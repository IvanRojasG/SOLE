from uuid import UUID

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.deps import get_current_athlete, require_role
from app.models.all_models import (
    Athlete,
    AthleteBaselinePR,
    AthleteBaselineSkill,
    MovementCatalog,
    SkillCatalog,
    User,
)
from app.schemas.baseline import (
    BaselineDetailedResponse,
    BaselineMeResponse,
    BaselinePRCreate,
    BaselinePRDetailedResponse,
    BaselinePRResponse,
    BaselineSkillCreate,
    BaselineSkillDetailedResponse,
    BaselineSkillResponse,
)
from app.schemas.common import MessageResponse
from app.services.baseline import create_pr, create_skill, lock_baseline, update_pr, update_skill


router = APIRouter()


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
    )
