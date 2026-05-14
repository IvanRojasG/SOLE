from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.deps import require_role
from app.models.all_models import Challenge, User
from app.schemas.catalog import ChallengeFinalizeRankingResponse, ChallengeResponse, ChallengeUpsertRequest
from app.services.wod_finalization import finalize_challenge_for_coach


router = APIRouter()
VALID_CHALLENGE_CATEGORIES = {"custom_metcon_reps", "power_lifting"}
VALID_SCORING_TYPES = {"for_time", "amrap_reps"}


def validate_challenge_payload(payload: ChallengeUpsertRequest) -> None:
    if payload.category not in VALID_CHALLENGE_CATEGORIES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid challenge category")
    if payload.scoring_type not in VALID_SCORING_TYPES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid challenge scoring type")
    if payload.category == "power_lifting" and payload.scoring_type != "for_time":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Power Lifting requires for_time scoring")
    if payload.end_date < payload.start_date:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Challenge end date cannot be before start date")


@router.get("", response_model=list[ChallengeResponse])
def list_challenges(session: Session = Depends(get_session)):
    return session.exec(select(Challenge).order_by(Challenge.start_date.desc(), Challenge.title)).all()


@router.post("", response_model=ChallengeResponse, status_code=status.HTTP_201_CREATED)
def create_challenge(
    payload: ChallengeUpsertRequest,
    _: User = Depends(require_role("coach")),
    session: Session = Depends(get_session),
):
    validate_challenge_payload(payload)
    existing = session.exec(select(Challenge).where(Challenge.title == payload.title)).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Challenge already exists")

    challenge = Challenge(
        title=payload.title,
        category=payload.category,
        summary=payload.summary,
        start_date=payload.start_date,
        end_date=payload.end_date,
        total_reps=payload.total_reps,
        scoring_type=payload.scoring_type,
        youtube_url=payload.youtube_url,
        is_active=payload.is_active,
    )
    session.add(challenge)
    session.commit()
    session.refresh(challenge)
    return challenge


@router.post("/{challenge_id}/finalize-ranking", response_model=ChallengeFinalizeRankingResponse)
def finalize_ranking(
    challenge_id: UUID,
    _: User = Depends(require_role("coach")),
    session: Session = Depends(get_session),
):
    return finalize_challenge_for_coach(session, challenge_id)


@router.put("/{challenge_id}", response_model=ChallengeResponse)
def update_challenge(
    challenge_id: UUID,
    payload: ChallengeUpsertRequest,
    _: User = Depends(require_role("coach")),
    session: Session = Depends(get_session),
):
    validate_challenge_payload(payload)
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
    challenge.summary = payload.summary
    challenge.start_date = payload.start_date
    challenge.end_date = payload.end_date
    challenge.total_reps = payload.total_reps
    challenge.scoring_type = payload.scoring_type
    challenge.youtube_url = payload.youtube_url
    challenge.is_active = payload.is_active
    session.add(challenge)
    session.commit()
    session.refresh(challenge)
    return challenge
