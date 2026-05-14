"""challenge scoring type

Revision ID: 0009_challenge_scoring_type
Revises: 0008_result_format
Create Date: 2026-05-14 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "0009_challenge_scoring_type"
down_revision = "0008_result_format"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "challenges",
        sa.Column("scoring_type", sa.String(length=20), nullable=False, server_default="for_time"),
    )
    op.alter_column("challenges", "scoring_type", server_default=None)


def downgrade() -> None:
    op.drop_column("challenges", "scoring_type")
