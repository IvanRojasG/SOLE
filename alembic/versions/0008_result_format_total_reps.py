"""result format total reps

Revision ID: 0008_result_format
Revises: 0007_wod_ranking
Create Date: 2026-05-05 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "0008_result_format"
down_revision = "0007_wod_ranking"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("challenges", sa.Column("total_reps", sa.Integer(), nullable=False, server_default="0"))
    op.add_column("achievements", sa.Column("result_format", sa.String(length=20), nullable=False, server_default="scaled"))
    op.alter_column("challenges", "total_reps", server_default=None)
    op.alter_column("achievements", "result_format", server_default=None)


def downgrade() -> None:
    op.drop_column("achievements", "result_format")
    op.drop_column("challenges", "total_reps")
