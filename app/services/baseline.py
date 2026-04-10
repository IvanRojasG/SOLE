from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.models.all_models import (
    Athlete,
    AthleteBaselinePR,
    AthleteBaselineSkill,
    MovementCatalog,
    SkillCatalog,
)
from app.schemas.baseline import BaselinePRCreate, BaselineSkillCreate


def ensure_baseline_editable(athlete: Athlete) -> None:
    if athlete.baseline_locked:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Baseline is locked")


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
