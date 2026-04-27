"""flexible baseline catalog

Revision ID: 0003_flexible_baseline_catalog
Revises: 0002_expand_challenges_metadata
Create Date: 2026-04-16 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "0003_flexible_baseline_catalog"
down_revision = "0002_expand_challenges_metadata"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "baseline_catalog_items",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("name", sa.String(length=120), nullable=False, unique=True),
        sa.Column("category", sa.String(length=30), nullable=False),
        sa.Column("metric_type", sa.String(length=20), nullable=False),
        sa.Column("unit", sa.String(length=20), nullable=False),
        sa.Column("description", sa.String(length=500), nullable=False, server_default=""),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("TRUE")),
        sa.Column("created_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("coaches.id"), nullable=True),
    )

    op.create_table(
        "athlete_baseline_entries",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("athlete_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("athletes.id"), nullable=False),
        sa.Column("item_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("baseline_catalog_items.id"), nullable=False),
        sa.Column("value_number", sa.Numeric(), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=True),
        sa.Column("notes", sa.String(length=300), nullable=False, server_default=""),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("NOW()")),
        sa.UniqueConstraint("athlete_id", "item_id", name="uq_athlete_baseline_entries"),
    )


def downgrade() -> None:
    op.drop_table("athlete_baseline_entries")
    op.drop_table("baseline_catalog_items")
