"""
Plan2Progress — Audit & Activity Presentation Service.

Formats audit logs into frontend TimelineUpdate, PlatformActivity, and SystemActivityLog contracts.
"""

from typing import List, Optional
import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import AuditLog
from app.repositories.audit_repository import AuditRepository
from app.schemas.audit import TimelineUpdate, PlatformActivity, SystemActivityLog


class AuditService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = AuditRepository(db)

    async def get_timeline_updates(
        self, project_id: Optional[uuid.UUID] = None, limit: int = 10
    ) -> List[TimelineUpdate]:
        logs = await self.repo.list_recent(project_id=project_id, limit=limit)
        items: List[TimelineUpdate] = []

        for log in logs:
            action_map = {
                "REPORT_PROCESSED": ("primary", "Report Ingested"),
                "MATCH_APPROVED": ("secondary", "Match Approved into P6"),
                "MATCH_REJECTED": ("neutral", "Candidate Rejected"),
                "SHIFT_NOTE_CREATED": ("primary", "Field Observation Recorded"),
            }
            color, default_detail = action_map.get(log.action, ("primary", log.action))

            time_str = log.created_at.strftime("%I:%M %p") if log.created_at else "Just now"

            detail = default_detail
            if log.details and isinstance(log.details, dict):
                if "activityCode" in log.details:
                    detail = f"Approved progress into {log.details['activityCode']}"
                elif "fileName" in log.details:
                    detail = f"Extracted updates from {log.details['fileName']}"

            items.append(
                TimelineUpdate(
                    id=str(log.id),
                    actor=log.user_name or "System AI",
                    role=log.role or "Planner",
                    time=time_str,
                    detail=detail,
                    dot_color=color,
                )
            )
        return items

    async def get_platform_activities(self, limit: int = 20) -> List[PlatformActivity]:
        logs = await self.repo.list_recent(limit=limit)
        items: List[PlatformActivity] = []

        for log in logs:
            time_str = log.created_at.strftime("%I:%M %p") if log.created_at else "Just now"
            items.append(
                PlatformActivity(
                    id=str(log.id),
                    time=time_str,
                    title=log.action.replace("_", " ").title(),
                    actor=log.user_name or "System",
                    project=str(log.project_id) if log.project_id else "All Projects",
                    category=log.entity_type,
                    detail=f"{log.action} executed on {log.entity_type}",
                    status="Success",
                )
            )
        return items

    async def get_system_logs(self, limit: int = 20) -> List[SystemActivityLog]:
        logs = await self.repo.list_recent(limit=limit)
        items: List[SystemActivityLog] = []

        for log in logs:
            time_str = log.created_at.strftime("%I:%M %p") if log.created_at else "Just now"
            items.append(
                SystemActivityLog(
                    id=str(log.id),
                    time=time_str,
                    user=log.user_name or "System",
                    action=log.action,
                    project=str(log.project_id) if log.project_id else "Global",
                    result="Success",
                    detail=f"Action on {log.entity_type} {log.entity_id or ''}".strip(),
                )
            )
        return items
