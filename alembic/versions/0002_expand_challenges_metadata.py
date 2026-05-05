"""expand challenges metadata

Revision ID: 0002_expand_challenges_metadata
Revises: 0001_initial_schema
Create Date: 2026-04-07 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "0002_expand_challenges_metadata"
down_revision = "0001_initial_schema"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "challenges",
        sa.Column("category", sa.String(length=30), nullable=False, server_default="consistency"),
    )
    op.add_column(
        "challenges",
        sa.Column("difficulty", sa.String(length=20), nullable=False, server_default="starter"),
    )
    op.add_column(
        "challenges",
        sa.Column("summary", sa.String(length=500), nullable=False, server_default="Reto mensual SOLE."),
    )
    op.add_column(
        "challenges",
        sa.Column("window_label", sa.String(length=80), nullable=False, server_default="Todo el mes"),
    )
    op.add_column(
        "challenges",
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("TRUE")),
    )

    op.execute(
        """
        UPDATE challenges
        SET category = CASE title
            WHEN 'Improve benchmark WOD' THEN 'conditioning'
            WHEN 'New gymnastics skill' THEN 'gymnastics'
            ELSE 'consistency'
        END,
        difficulty = CASE title
            WHEN 'Improve benchmark WOD' THEN 'beast'
            WHEN 'New gymnastics skill' THEN 'builder'
            ELSE 'starter'
        END,
        summary = CASE title
            WHEN 'Improve benchmark WOD' THEN 'Mejora tu tiempo o score frente a un benchmark definido por el box.'
            WHEN 'New gymnastics skill' THEN 'Consigue una nueva skill técnica validada por coach.'
            ELSE 'Reto mensual SOLE.'
        END,
        window_label = CASE title
            WHEN 'Improve benchmark WOD' THEN 'Todo el mes'
            WHEN 'New gymnastics skill' THEN 'Todo el mes'
            ELSE 'Todo el mes'
        END,
        is_active = TRUE
        """
    )

    op.alter_column("challenges", "category", server_default=None)
    op.alter_column("challenges", "difficulty", server_default=None)
    op.alter_column("challenges", "summary", server_default=None)
    op.alter_column("challenges", "window_label", server_default=None)
    op.alter_column("challenges", "is_active", server_default=None)


def downgrade() -> None:
    op.drop_column("challenges", "is_active")
    op.drop_column("challenges", "window_label")
    op.drop_column("challenges", "summary")
    op.drop_column("challenges", "difficulty")
    op.drop_column("challenges", "category")
