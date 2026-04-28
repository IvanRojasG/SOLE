from pathlib import Path
import sys

from sqlmodel import Session, select

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.db import engine
from app.core.security import hash_password
from app.models.all_models import Coach, User


COACHES = [
    {
        "email": "coach.mau@solefitness.com",
        "password": "CoachMau123!",
        "full_name": "Coach Mau",
    },
    {
        "email": "coach.chilli@solefitness.com",
        "password": "CoachChilli123!",
        "full_name": "Coach Chilli",
    },
]


def upsert_coach(session: Session, coach_data: dict[str, str]) -> None:
    user = session.exec(select(User).where(User.email == coach_data["email"])).first()

    if not user:
        user = User(
            email=coach_data["email"],
            password_hash=hash_password(coach_data["password"]),
            role="coach",
            is_active=True,
        )
        session.add(user)
        session.flush()
        print(f"created user: {coach_data['email']}")
    else:
        user.role = "coach"
        user.is_active = True
        session.add(user)
        print(f"updated user: {coach_data['email']}")

    coach = session.exec(select(Coach).where(Coach.user_id == user.id)).first()

    if not coach:
        coach = Coach(user_id=user.id, full_name=coach_data["full_name"])
        session.add(coach)
        print(f"created coach profile: {coach_data['full_name']}")
    else:
        coach.full_name = coach_data["full_name"]
        session.add(coach)
        print(f"updated coach profile: {coach_data['full_name']}")


def main() -> None:
    with Session(engine) as session:
        for coach_data in COACHES:
            upsert_coach(session, coach_data)

        session.commit()

    print("coach users ready")
    for coach_data in COACHES:
        print(f"- {coach_data['email']} / {coach_data['password']}")


if __name__ == "__main__":
    main()
