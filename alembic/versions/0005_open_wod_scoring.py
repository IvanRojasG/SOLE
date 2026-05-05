"""open wod scoring

Revision ID: 0005_open_wod_scoring
Revises: 0004_password_reset_tokens
Create Date: 2026-05-04 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "0005_open_wod_scoring"
down_revision = "0004_password_reset_tokens"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("achievements", sa.Column("completed", sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column("achievements", sa.Column("time_seconds", sa.Integer(), nullable=True))
    op.add_column("achievements", sa.Column("reps_completed", sa.Integer(), nullable=True))
    op.add_column("achievements", sa.Column("rank_points", sa.Integer(), nullable=True))
    op.alter_column("achievements", "completed", server_default=None)


def downgrade() -> None:
    op.drop_column("achievements", "rank_points")
    op.drop_column("achievements", "reps_completed")
    op.drop_column("achievements", "time_seconds")
    op.drop_column("achievements", "completed")
