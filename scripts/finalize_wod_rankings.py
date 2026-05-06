from argparse import ArgumentParser
from pathlib import Path
from sys import path
from uuid import UUID

from sqlmodel import Session, select

ROOT_DIR = Path(__file__).resolve().parents[1]
path.append(str(ROOT_DIR))

from app.core.db import engine  # noqa: E402
from app.models.all_models import Challenge  # noqa: E402
from app.services.ranking import challenge_is_closed, finalize_challenge_rank_points  # noqa: E402


def parse_args():
    parser = ArgumentParser(
        description="Clear open WOD rank points and finalize points for closed WODs.",
    )
    parser.add_argument(
        "--challenge-id",
        help="Limit recalculation to a single challenge id.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    with Session(engine) as session:
        statement = select(Challenge).order_by(Challenge.end_date.asc())
        if args.challenge_id:
            statement = statement.where(Challenge.id == UUID(args.challenge_id))

        challenges = session.exec(statement).all()
        for challenge in challenges:
            result = finalize_challenge_rank_points(session, challenge)
            state = "finalized" if challenge_is_closed(challenge) else "cleared-open"
            print(
                f"{state}: {challenge.title} ({challenge.id}) "
                f"cleared={result['cleared']} ranked={result['ranked']}",
            )

        session.commit()


if __name__ == "__main__":
    main()
