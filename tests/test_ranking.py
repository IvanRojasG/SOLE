from datetime import date
import unittest
from uuid import uuid4

from sqlmodel import Session, SQLModel, create_engine

from app.models.all_models import Achievement, Athlete, Challenge
from app.services.ranking import get_event_ranking


def build_session():
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)
    return Session(engine)


def add_athlete(session: Session, name: str) -> Athlete:
    athlete = Athlete(user_id=uuid4(), full_name=name, level="scaled")
    session.add(athlete)
    session.commit()
    session.refresh(athlete)
    return athlete


def add_challenge(session: Session, title: str) -> Challenge:
    challenge = Challenge(
        title=title,
        category="custom_metcon_reps",
        summary="",
        start_date=date(2026, 1, 1),
        end_date=date(2026, 1, 2),
        is_active=True,
    )
    session.add(challenge)
    session.commit()
    session.refresh(challenge)
    return challenge


def add_ranked_result(session: Session, athlete: Athlete, challenge: Challenge, points: int) -> None:
    session.add(
        Achievement(
            athlete_id=athlete.id,
            challenge_id=challenge.id,
            achievement_date=challenge.end_date,
            status="approved",
            completed=True,
            result_format="scaled",
            time_seconds=600 + points,
            rank_points=points,
        )
    )
    session.commit()


class EventRankingTest(unittest.TestCase):
    def test_event_ranking_prioritizes_completed_wods_before_low_points(self):
        session = build_session()
        wod_one = add_challenge(session, "WOD 1")
        wod_two = add_challenge(session, "WOD 2")
        incomplete = add_athlete(session, "Ana Incompleta")
        complete = add_athlete(session, "Bruno Completo")

        add_ranked_result(session, incomplete, wod_one, 1)
        add_ranked_result(session, complete, wod_one, 4)
        add_ranked_result(session, complete, wod_two, 5)

        ranking = get_event_ranking(session)

        self.assertEqual([row["athlete_name"] for row in ranking[:2]], ["Bruno Completo", "Ana Incompleta"])
        self.assertEqual(ranking[0]["wods_scored"], 2)
        self.assertEqual(ranking[0]["missing_wods"], 0)
        self.assertEqual(ranking[1]["points"], 1)
        self.assertEqual(ranking[1]["missing_wods"], 1)

    def test_event_ranking_uses_lowest_points_when_wod_count_matches(self):
        session = build_session()
        wod_one = add_challenge(session, "WOD 1")
        wod_two = add_challenge(session, "WOD 2")
        lower_points = add_athlete(session, "Carla Menor")
        higher_points = add_athlete(session, "Daniel Mayor")

        add_ranked_result(session, lower_points, wod_one, 1)
        add_ranked_result(session, lower_points, wod_two, 2)
        add_ranked_result(session, higher_points, wod_one, 2)
        add_ranked_result(session, higher_points, wod_two, 3)

        ranking = get_event_ranking(session)

        self.assertEqual([row["athlete_name"] for row in ranking[:2]], ["Carla Menor", "Daniel Mayor"])
        self.assertEqual(ranking[0]["points"], 3)
        self.assertIs(ranking[0]["is_event_complete"], True)


if __name__ == "__main__":
    unittest.main()
