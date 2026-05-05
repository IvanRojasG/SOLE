from sqlmodel import Session, select

from app.core.security import hash_password
from app.models.all_models import Athlete, BaselineCatalogItem, Coach, MovementCatalog, SkillCatalog, User


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
DEFAULT_BASELINE_ITEMS = [
    {
        "name": "Back squat 1RM",
        "category": "weightlifting",
        "metric_type": "weight",
        "unit": "lb",
        "description": "Carga máxima para una repetición.",
    },
    {
        "name": "Deadlift 1RM",
        "category": "weightlifting",
        "metric_type": "weight",
        "unit": "lb",
        "description": "Carga máxima para una repetición.",
    },
    {
        "name": "Snatch 1RM",
        "category": "weightlifting",
        "metric_type": "weight",
        "unit": "lb",
        "description": "Carga máxima técnica para una repetición.",
    },
    {
        "name": "Fran",
        "category": "wod",
        "metric_type": "time",
        "unit": "seconds",
        "description": "Tiempo total del benchmark en segundos.",
    },
    {
        "name": "Pull-ups unbroken",
        "category": "gymnastics",
        "metric_type": "reps",
        "unit": "reps",
        "description": "Máximo set continuo.",
    },
    {
        "name": "Double unders",
        "category": "skill",
        "metric_type": "status",
        "unit": "status",
        "description": "Nivel técnico actual.",
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

    for item_data in DEFAULT_BASELINE_ITEMS:
        item = session.exec(select(BaselineCatalogItem).where(BaselineCatalogItem.name == item_data["name"])).first()
        if not item:
            session.add(BaselineCatalogItem(**item_data))
            continue

        item.category = item_data["category"]
        item.metric_type = item_data["metric_type"]
        item.unit = item_data["unit"]
        item.description = item_data["description"]
        item.is_active = True
        session.add(item)

    session.commit()
