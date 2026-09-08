"""initial_schema

Revision ID: 001_initial
Revises:
Create Date: 2026-09-08 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Users
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), unique=True, nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("role", sa.String(100), nullable=False),
        sa.Column("role_type", sa.String(20), nullable=False),
        sa.Column("department", sa.String(255), nullable=True),
        sa.Column("initials", sa.String(10), nullable=True),
        sa.Column("avatar_color", sa.String(20), nullable=True),
        sa.Column("status", sa.String(20), server_default="Active", nullable=False),
        sa.Column("permissions", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("disallowed_actions", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("last_active_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    # 2. Projects
    op.create_table(
        "projects",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("code", sa.String(50), unique=True, nullable=False),
        sa.Column("location", sa.String(255), nullable=True),
        sa.Column("manager", sa.String(255), nullable=True),
        sa.Column("status", sa.String(50), server_default="On Track", nullable=False),
        sa.Column("progress_pct", sa.Float(), server_default="0.0", nullable=False),
        sa.Column("schedule_status", sa.String(50), server_default="Healthy", nullable=False),
        sa.Column("open_issues", sa.Integer(), server_default="0", nullable=False),
        sa.Column("start_date", sa.Date(), nullable=True),
        sa.Column("target_completion", sa.Date(), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    # 3. User Projects
    op.create_table(
        "user_projects",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("project_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("role_in_project", sa.String(100), nullable=True),
        sa.Column("assigned_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    # 4. Schedules
    op.create_table(
        "schedules",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("project_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("file_name", sa.String(255), nullable=False),
        sa.Column("file_type", sa.String(50), nullable=False),
        sa.Column("version", sa.Integer(), server_default="1", nullable=False),
        sa.Column("total_activities", sa.Integer(), server_default="0", nullable=False),
        sa.Column("baseline_start", sa.Date(), nullable=True),
        sa.Column("baseline_finish", sa.Date(), nullable=True),
        sa.Column("uploaded_by", sa.String(255), nullable=True),
        sa.Column("status", sa.String(50), server_default="Active", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    # 5. Activities
    op.create_table(
        "activities",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("schedule_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("schedules.id", ondelete="CASCADE"), nullable=False),
        sa.Column("activity_code", sa.String(100), nullable=False),
        sa.Column("name", sa.String(500), nullable=False),
        sa.Column("wbs_code", sa.String(100), nullable=True),
        sa.Column("work_package", sa.String(255), nullable=True),
        sa.Column("level", sa.String(10), server_default="L5", nullable=False),
        sa.Column("planned_start", sa.Date(), nullable=True),
        sa.Column("planned_finish", sa.Date(), nullable=True),
        sa.Column("planned_quantity", sa.Float(), server_default="0.0", nullable=False),
        sa.Column("actual_quantity", sa.Float(), server_default="0.0", nullable=False),
        sa.Column("uom", sa.String(50), server_default="units", nullable=False),
        sa.Column("progress_pct", sa.Float(), server_default="0.0", nullable=False),
        sa.Column("status", sa.String(50), server_default="Not Started", nullable=False),
        sa.Column("corridor_start", sa.String(100), nullable=True),
        sa.Column("corridor_finish", sa.String(100), nullable=True),
        sa.Column("is_critical", sa.Boolean(), server_default="false", nullable=False),
        sa.Column("float_days", sa.Integer(), server_default="0", nullable=False),
        sa.Column("remarks", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    # 6. Progress Reports
    op.create_table(
        "progress_reports",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("project_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("file_name", sa.String(255), nullable=False),
        sa.Column("file_type", sa.String(50), nullable=False),
        sa.Column("file_size", sa.String(50), nullable=True),
        sa.Column("submitted_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("status", sa.String(50), server_default="Need Review", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    # 7. Progress Events
    op.create_table(
        "progress_events",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("report_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("progress_reports.id", ondelete="CASCADE"), nullable=False),
        sa.Column("project_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("reported_quantity", sa.Float(), nullable=True),
        sa.Column("reported_uom", sa.String(50), nullable=True),
        sa.Column("location_corridor", sa.String(255), nullable=True),
        sa.Column("chainage_start", sa.String(100), nullable=True),
        sa.Column("chainage_end", sa.String(100), nullable=True),
        sa.Column("execution_date", sa.Date(), nullable=True),
        sa.Column("shift", sa.String(50), nullable=True),
        sa.Column("raw_quote", sa.Text(), nullable=True),
        sa.Column("extraction_confidence", sa.Float(), server_default="1.0", nullable=False),
        sa.Column("photo_url", sa.String(500), nullable=True),
        sa.Column("extra_metadata", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    # 8. Activity Matches
    op.create_table(
        "activity_matches",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("event_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("progress_events.id", ondelete="CASCADE"), nullable=False),
        sa.Column("activity_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("activities.id", ondelete="CASCADE"), nullable=False),
        sa.Column("confidence_score", sa.Float(), nullable=False),
        sa.Column("match_rationale", sa.Text(), nullable=True),
        sa.Column("status", sa.String(50), server_default="Pending", nullable=False),
        sa.Column("reviewed_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("reviewed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("reviewer_notes", sa.Text(), nullable=True),
        sa.Column("alternative_candidates", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    # 9. Audit Logs
    op.create_table(
        "audit_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("project_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("user_name", sa.String(255), nullable=True),
        sa.Column("role", sa.String(100), nullable=True),
        sa.Column("action", sa.String(100), nullable=False),
        sa.Column("entity_type", sa.String(100), nullable=False),
        sa.Column("entity_id", sa.String(255), nullable=True),
        sa.Column("details", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    # 10. Shift Notes
    op.create_table(
        "shift_notes",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("project_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("author_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("author_name", sa.String(255), nullable=True),
        sa.Column("chainage", sa.String(255), nullable=True),
        sa.Column("category", sa.String(50), nullable=True),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("photo_url", sa.String(500), nullable=True),
        sa.Column("photo_caption", sa.String(500), nullable=True),
        sa.Column("note_date", sa.Date(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    # 11. Data Sources
    op.create_table(
        "data_sources",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("source_type", sa.String(100), nullable=True),
        sa.Column("status", sa.String(30), server_default="Coming Soon", nullable=False),
        sa.Column("last_sync", sa.DateTime(timezone=True), nullable=True),
        sa.Column("records_processed", sa.Integer(), server_default="0", nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("data_sources")
    op.drop_table("shift_notes")
    op.drop_table("audit_logs")
    op.drop_table("activity_matches")
    op.drop_table("progress_events")
    op.drop_table("progress_reports")
    op.drop_table("activities")
    op.drop_table("schedules")
    op.drop_table("user_projects")
    op.drop_table("projects")
    op.drop_table("users")
