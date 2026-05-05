"""remove attendance

Revision ID: 0006_remove_attendance
Revises: 0005_open_wod_scoring
Create Date: 2026-05-04 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "0006_remove_attendance"
down_revision = "0005_open_wod_scoring"
branch_labels = None
depends_on = None


ATTENDANCE_CHALLENGE_TITLES = ("Attend 5 classes", "Three-week consistency")


def upgrade() -> None:
    titles_sql = ", ".join(f"'{title}'" for title in ATTENDANCE_CHALLENGE_TITLES)
    op.execute(
        sa.text(
            f"""
            DELETE FROM points_ledger
            WHERE source_id IN (
                SELECT achievements.id
                FROM achievements
                JOIN challenges ON challenges.id = achievements.challenge_id
                WHERE challenges.title IN ({titles_sql})
            )
            """
        )
    )
    op.execute(
        sa.text(
            f"""
            DELETE FROM achievements
            USING challenges
            WHERE achievements.challenge_id = challenges.id
              AND challenges.title IN ({titles_sql})
            """
        )
    )
    op.execute(sa.text(f"DELETE FROM challenges WHERE title IN ({titles_sql})"))
    op.drop_table("attendance_records")
    op.drop_table("attendance_sessions")


def downgrade() -> None:
    op.create_table(
        "attendance_sessions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("session_date", sa.Date(), nullable=False),
        sa.Column("coach_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("coaches.id"), nullable=False),
        sa.UniqueConstraint("session_date", "coach_id", name="uq_attendance_session_date_coach"),
    )
    op.create_table(
        "attendance_records",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("session_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("attendance_sessions.id"), nullable=False),
        sa.Column("athlete_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("athletes.id"), nullable=False),
        sa.UniqueConstraint("session_id", "athlete_id", name="uq_attendance_records"),
    )
