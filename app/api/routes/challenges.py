from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.deps import require_role
from app.models.all_models import Challenge, User
from app.schemas.catalog import ChallengeResponse, ChallengeUpsertRequest


router = APIRouter()


@router.get("", response_model=list[ChallengeResponse])
def list_challenges(session: Session = Depends(get_session)):
    return session.exec(select(Challenge).order_by(Challenge.title)).all()


@router.post("", response_model=ChallengeResponse, status_code=status.HTTP_201_CREATED)
def create_challenge(
    payload: ChallengeUpsertRequest,
    _: User = Depends(require_role("coach")),
    session: Session = Depends(get_session),
):
    existing = session.exec(select(Challenge).where(Challenge.title == payload.title)).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Challenge already exists")

    challenge = Challenge(
        title=payload.title,
        category=payload.category,
        difficulty=payload.difficulty,
        summary=payload.summary,
        window_label=payload.window_label,
        is_active=payload.is_active,
        points=payload.points,
    )
    session.add(challenge)
    session.commit()
    session.refresh(challenge)
    return challenge


@router.put("/{challenge_id}", response_model=ChallengeResponse)
def update_challenge(
    challenge_id: UUID,
    payload: ChallengeUpsertRequest,
    _: User = Depends(require_role("coach")),
    session: Session = Depends(get_session),
):
    challenge = session.get(Challenge, challenge_id)
    if not challenge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found")

    duplicate = session.exec(
        select(Challenge).where(Challenge.title == payload.title, Challenge.id != challenge_id)
    ).first()
    if duplicate:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Challenge title already in use")

    challenge.title = payload.title
    challenge.category = payload.category
    challenge.difficulty = payload.difficulty
    challenge.summary = payload.summary
    challenge.window_label = payload.window_label
    challenge.is_active = payload.is_active
    challenge.points = payload.points
    session.add(challenge)
    session.commit()
    session.refresh(challenge)
    return challenge
