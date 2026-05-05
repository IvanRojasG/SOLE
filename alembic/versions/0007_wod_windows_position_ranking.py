"""wod windows position ranking

Revision ID: 0007_wod_ranking
Revises: 0006_remove_attendance
Create Date: 2026-05-05 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "0007_wod_ranking"
down_revision = "0006_remove_attendance"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(sa.text("DELETE FROM points_ledger"))
    op.execute(sa.text("DELETE FROM achievements"))
    op.execute(sa.text("DELETE FROM challenges"))

    op.add_column("challenges", sa.Column("start_date", sa.Date(), nullable=False, server_default=sa.text("CURRENT_DATE")))
    op.add_column("challenges", sa.Column("end_date", sa.Date(), nullable=False, server_default=sa.text("CURRENT_DATE")))
    op.add_column("challenges", sa.Column("youtube_url", sa.String(length=300), nullable=False, server_default=""))
    op.drop_column("challenges", "points")
    op.drop_column("challenges", "difficulty")
    op.drop_column("challenges", "window_label")
    op.alter_column("challenges", "start_date", server_default=None)
    op.alter_column("challenges", "end_date", server_default=None)
    op.alter_column("challenges", "youtube_url", server_default=None)

    op.add_column("achievements", sa.Column("weight_lbs", sa.Numeric(), nullable=True))
    op.add_column("achievements", sa.Column("tie_break_order", sa.Integer(), nullable=True))


def downgrade() -> None:
    op.drop_column("achievements", "tie_break_order")
    op.drop_column("achievements", "weight_lbs")

    op.add_column("challenges", sa.Column("window_label", sa.String(length=80), nullable=False, server_default="Todo el mes"))
    op.add_column("challenges", sa.Column("difficulty", sa.String(length=20), nullable=False, server_default="starter"))
    op.add_column("challenges", sa.Column("points", sa.Integer(), nullable=False, server_default="1"))
    op.drop_column("challenges", "youtube_url")
    op.drop_column("challenges", "end_date")
    op.drop_column("challenges", "start_date")
    op.alter_column("challenges", "window_label", server_default=None)
    op.alter_column("challenges", "difficulty", server_default=None)
    op.alter_column("challenges", "points", server_default=None)
