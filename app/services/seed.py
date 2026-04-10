from sqlmodel import Session, select

from app.core.security import hash_password
from app.models.all_models import Athlete, Challenge, Coach, MovementCatalog, SkillCatalog, User


DEFAULT_COACHES = [
    {"email": "coach1@example.com", "password": "Coach1234!", "full_name": "Coach One"},
    {"email": "coach2@example.com", "password": "Coach1234!", "full_name": "Coach Two"},
]
DEFAULT_ATHLETES = [
    {
        "email": "athlete3@example.com",
        "password": "Athlete123!",
        "full_name": "Camila Rios",
        "level": "scaled",
    }
]

DEFAULT_MOVEMENTS = ["back squat", "deadlift", "snatch"]
DEFAULT_SKILLS = ["pull-ups", "double unders", "toes to bar"]
DEFAULT_CHALLENGES = [
    {
        "title": "Attend 5 classes",
        "category": "consistency",
        "difficulty": "starter",
        "summary": "Completa cinco asistencias validadas dentro del mismo ciclo mensual.",
        "window_label": "Semana 1-2",
        "is_active": True,
        "points": 5,
    },
    {
        "title": "Improve benchmark WOD",
        "category": "conditioning",
        "difficulty": "beast",
        "summary": "Mejora tu tiempo o score frente a un benchmark definido por el box.",
        "window_label": "Todo el mes",
        "is_active": True,
        "points": 10,
    },
    {
        "title": "New gymnastics skill",
        "category": "gymnastics",
        "difficulty": "builder",
        "summary": "Consigue una nueva skill técnica validada por coach.",
        "window_label": "Todo el mes",
        "is_active": True,
        "points": 8,
    },
]


def seed_initial_data(session: Session) -> None:
    for coach_data in DEFAULT_COACHES:
        user = session.exec(select(User).where(User.email == coach_data["email"])).first()
        if not user:
            user = User(
                email=coach_data["email"],
                password_hash=hash_password(coach_data["password"]),
                role="coach",
            )
            session.add(user)
            session.flush()
            session.add(Coach(user_id=user.id, full_name=coach_data["full_name"]))

    for athlete_data in DEFAULT_ATHLETES:
        user = session.exec(select(User).where(User.email == athlete_data["email"])).first()
        if not user:
            user = User(
                email=athlete_data["email"],
                password_hash=hash_password(athlete_data["password"]),
                role="athlete",
            )
            session.add(user)
            session.flush()
            session.add(
                Athlete(
                    user_id=user.id,
                    full_name=athlete_data["full_name"],
                    level=athlete_data["level"],
                )
            )

    for movement_name in DEFAULT_MOVEMENTS:
        if not session.exec(select(MovementCatalog).where(MovementCatalog.name == movement_name)).first():
            session.add(MovementCatalog(name=movement_name))

    for skill_name in DEFAULT_SKILLS:
        if not session.exec(select(SkillCatalog).where(SkillCatalog.name == skill_name)).first():
            session.add(SkillCatalog(name=skill_name))

    for challenge_data in DEFAULT_CHALLENGES:
        challenge = session.exec(select(Challenge).where(Challenge.title == challenge_data["title"])).first()
        if not challenge:
            session.add(Challenge(**challenge_data))
            continue

        challenge.category = challenge_data["category"]
        challenge.difficulty = challenge_data["difficulty"]
        challenge.summary = challenge_data["summary"]
        challenge.window_label = challenge_data["window_label"]
        challenge.is_active = challenge_data["is_active"]
        challenge.points = challenge_data["points"]
        session.add(challenge)

    session.commit()
