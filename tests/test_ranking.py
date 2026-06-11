from datetime import date
import unittest
from uuid import uuid4

from fastapi import HTTPException
from sqlmodel import Session, SQLModel, create_engine

from app.models.all_models import Achievement, Athlete, Challenge
from app.schemas.achievement import AchievementCreate
from app.services.achievements import submit_achievement
from app.services.athlete_scores import get_athlete_scores
from app.services.ranking import get_event_ranking
from app.services.reports import get_classifier_wod_report


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


def build_achievement_payload(challenge: Challenge, achievement_date: date | None = None) -> AchievementCreate:
    return AchievementCreate(
        challenge_id=challenge.id,
        achievement_date=achievement_date or challenge.end_date,
        completed=True,
        result_format="scaled",
        time_seconds=600,
        reps_completed=challenge.total_reps,
    )


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


class AchievementSubmissionWindowTest(unittest.TestCase):
    def test_athlete_late_submission_can_be_saved_as_pending(self):
        session = build_session()
        athlete = add_athlete(session, "Late Athlete")
        challenge = add_challenge(session, "Closed WOD")

        achievement = submit_achievement(
            session,
            athlete,
            build_achievement_payload(challenge),
            allow_outside_window=True,
        )

        self.assertEqual(achievement.status, "submitted")
        self.assertEqual(achievement.athlete_id, athlete.id)
        self.assertEqual(achievement.challenge_id, challenge.id)

    def test_athlete_submission_before_start_date_stays_blocked(self):
        session = build_session()
        athlete = add_athlete(session, "Early Athlete")
        challenge = add_challenge(session, "Future WOD")
        challenge.start_date = date(2999, 1, 1)
        challenge.end_date = date(2999, 1, 2)
        session.add(challenge)
        session.commit()

        with self.assertRaises(HTTPException) as caught:
            submit_achievement(
                session,
                athlete,
                build_achievement_payload(challenge, achievement_date=challenge.start_date),
                allow_outside_window=True,
            )

        self.assertEqual(caught.exception.status_code, 400)
        self.assertEqual(caught.exception.detail, "Challenge is outside its submission window")

    def test_inactive_challenge_stays_blocked_for_late_submission(self):
        session = build_session()
        athlete = add_athlete(session, "Inactive Athlete")
        challenge = add_challenge(session, "Inactive WOD")
        challenge.is_active = False
        session.add(challenge)
        session.commit()

        with self.assertRaises(HTTPException) as caught:
            submit_achievement(
                session,
                athlete,
                build_achievement_payload(challenge),
                allow_outside_window=True,
            )

        self.assertEqual(caught.exception.status_code, 400)
        self.assertEqual(caught.exception.detail, "Challenge is not active")

    def test_late_submission_still_rejects_duplicate_same_day(self):
        session = build_session()
        athlete = add_athlete(session, "Duplicate Athlete")
        challenge = add_challenge(session, "Duplicate WOD")
        payload = build_achievement_payload(challenge)

        submit_achievement(session, athlete, payload, allow_outside_window=True)

        with self.assertRaises(HTTPException) as caught:
            submit_achievement(session, athlete, payload, allow_outside_window=True)

        self.assertEqual(caught.exception.status_code, 409)
        self.assertEqual(caught.exception.detail, "Duplicate achievement is not allowed")


class AthleteScoresTest(unittest.TestCase):
    def test_scores_include_all_attempts_and_mark_best_approved_attempt(self):
        session = build_session()
        athlete = add_athlete(session, "Multi Attempt")
        challenge = add_challenge(session, "Repeatable WOD")

        attempts = [
            Achievement(
                athlete_id=athlete.id,
                challenge_id=challenge.id,
                achievement_date=date(2026, 1, 1),
                status="approved",
                completed=True,
                result_format="scaled",
                time_seconds=620,
            ),
            Achievement(
                athlete_id=athlete.id,
                challenge_id=challenge.id,
                achievement_date=date(2026, 1, 2),
                status="approved",
                completed=True,
                result_format="scaled",
                time_seconds=580,
                rank_points=1,
            ),
            Achievement(
                athlete_id=athlete.id,
                challenge_id=challenge.id,
                achievement_date=date(2026, 1, 3),
                status="submitted",
                completed=True,
                result_format="scaled",
                time_seconds=540,
            ),
            Achievement(
                athlete_id=athlete.id,
                challenge_id=challenge.id,
                achievement_date=date(2026, 1, 4),
                status="rejected",
                completed=True,
                result_format="scaled",
                time_seconds=500,
            ),
        ]
        session.add_all(attempts)
        session.commit()

        scores = get_athlete_scores(session, athlete.id)
        score_group = scores["scores"][0]
        marked_attempts = [
            attempt for attempt in score_group["attempts"] if attempt["counts_for_leaderboard"]
        ]

        self.assertEqual(len(score_group["attempts"]), 4)
        self.assertEqual(len(marked_attempts), 1)
        self.assertEqual(marked_attempts[0]["time_seconds"], 580)

    def test_scores_never_mark_pending_or_rejected_attempts(self):
        session = build_session()
        athlete = add_athlete(session, "Pending Only")
        challenge = add_challenge(session, "Unapproved WOD")
        session.add_all(
            [
                Achievement(
                    athlete_id=athlete.id,
                    challenge_id=challenge.id,
                    achievement_date=date(2026, 1, 1),
                    status="submitted",
                    completed=True,
                    result_format="scaled",
                    time_seconds=520,
                ),
                Achievement(
                    athlete_id=athlete.id,
                    challenge_id=challenge.id,
                    achievement_date=date(2026, 1, 2),
                    status="rejected",
                    completed=True,
                    result_format="scaled",
                    time_seconds=510,
                ),
            ]
        )
        session.commit()

        scores = get_athlete_scores(session, athlete.id)

        self.assertEqual(len(scores["scores"][0]["attempts"]), 2)
        self.assertFalse(
            any(attempt["counts_for_leaderboard"] for attempt in scores["scores"][0]["attempts"])
        )


class ClassifierWodReportTest(unittest.TestCase):
    def test_report_only_includes_approved_ranked_results(self):
        session = build_session()
        athlete = add_athlete(session, "Reporte Atleta")
        challenge = add_challenge(session, "Reporte WOD")
        other_challenge = add_challenge(session, "Pendiente WOD")
        session.add_all(
            [
                Achievement(
                    athlete_id=athlete.id,
                    challenge_id=challenge.id,
                    achievement_date=challenge.end_date,
                    status="approved",
                    completed=True,
                    result_format="rx",
                    time_seconds=480,
                    rank_points=2,
                ),
                Achievement(
                    athlete_id=athlete.id,
                    challenge_id=challenge.id,
                    achievement_date=date(2026, 1, 1),
                    status="submitted",
                    completed=True,
                    result_format="rx",
                    time_seconds=470,
                    rank_points=None,
                ),
                Achievement(
                    athlete_id=athlete.id,
                    challenge_id=other_challenge.id,
                    achievement_date=other_challenge.end_date,
                    status="approved",
                    completed=True,
                    result_format="scaled",
                    time_seconds=510,
                    rank_points=None,
                ),
            ]
        )
        session.commit()

        report = get_classifier_wod_report(session)

        self.assertEqual(report["total_rows"], 1)
        self.assertEqual(report["rows"][0]["athlete_name"], "Reporte Atleta")
        self.assertEqual(report["rows"][0]["challenge_title"], "Reporte WOD")
        self.assertEqual(report["rows"][0]["result_format"], "rx")
        self.assertEqual(report["rows"][0]["score_label"], "8:00")

    def test_report_omits_athletes_without_classifier_wods(self):
        session = build_session()
        add_athlete(session, "Sin WOD")

        report = get_classifier_wod_report(session)

        self.assertEqual(report["total_rows"], 0)
        self.assertEqual(report["rows"], [])


if __name__ == "__main__":
    unittest.main()
