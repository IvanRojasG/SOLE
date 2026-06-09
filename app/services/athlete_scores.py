from collections import defaultdict
from uuid import UUID

from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.models.all_models import Achievement, Athlete, Challenge
from app.services.ranking import achievement_result_sort_key, challenge_is_closed


def get_athlete_scores(session: Session, athlete_id: UUID):
    athlete = session.get(Athlete, athlete_id)
    if not athlete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Athlete not found")

    achievements = session.exec(
        select(Achievement)
        .where(Achievement.athlete_id == athlete.id)
        .order_by(Achievement.created_at.desc(), Achievement.achievement_date.desc())
    ).all()
    if not achievements:
        return {
            "athlete_id": athlete.id,
            "athlete_name": athlete.full_name,
            "level": athlete.level,
            "scores": [],
        }

    challenge_ids = {achievement.challenge_id for achievement in achievements}
    challenges = {
        challenge.id: challenge
        for challenge in session.exec(select(Challenge).where(Challenge.id.in_(list(challenge_ids)))).all()
    }

    grouped_attempts = defaultdict(list)
    for achievement in achievements:
        grouped_attempts[achievement.challenge_id].append(achievement)

    scores = []
    for challenge_id, attempts in grouped_attempts.items():
        challenge = challenges.get(challenge_id)
        if not challenge:
            continue

        approved_attempts = [attempt for attempt in attempts if attempt.status == "approved"]
        counted_attempt_id = None
        if approved_attempts:
            counted_attempt_id = min(
                approved_attempts,
                key=lambda attempt: achievement_result_sort_key(challenge, attempt),
            ).id

        sorted_attempts = sorted(
            attempts,
            key=lambda attempt: (
                attempt.id != counted_attempt_id,
                attempt.status != "approved",
                achievement_result_sort_key(challenge, attempt),
                attempt.created_at,
            ),
        )

        scores.append(
            {
                "challenge_id": challenge.id,
                "challenge_title": challenge.title,
                "challenge_category": challenge.category,
                "challenge_scoring_type": challenge.scoring_type,
                "challenge_end_date": challenge.end_date,
                "is_finalized": challenge_is_closed(challenge),
                "attempts": [
                    {
                        "id": attempt.id,
                        "achievement_date": attempt.achievement_date,
                        "status": attempt.status,
                        "completed": attempt.completed,
                        "result_format": attempt.result_format,
                        "time_seconds": attempt.time_seconds,
                        "reps_completed": attempt.reps_completed,
                        "weight_lbs": attempt.weight_lbs,
                        "tie_break_order": attempt.tie_break_order,
                        "rank_points": attempt.rank_points,
                        "created_at": attempt.created_at,
                        "counts_for_leaderboard": attempt.id == counted_attempt_id,
                    }
                    for attempt in sorted_attempts
                ],
            }
        )

    scores.sort(key=lambda score: (score["challenge_end_date"], score["challenge_title"]), reverse=True)

    return {
        "athlete_id": athlete.id,
        "athlete_name": athlete.full_name,
        "level": athlete.level,
        "scores": scores,
    }
