"""
Plan2Progress — Audit & Activities Router.
Powers HomeScreen recent updates timeline and Admin activity logs.
"""

from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.services.audit_service import AuditService
from app.schemas.audit import TimelineUpdate, PlatformActivity, SystemActivityLog

router = APIRouter(prefix="/audit", tags=["Audit & Activity Logs"])


@router.get("/timeline", response_model=List[TimelineUpdate])
async def get_recent_timeline(
    project_id: Optional[uuid.UUID] = None,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
):
    """Fetch recent activity timeline updates for project dashboard."""
    service = AuditService(db)
    return await service.get_timeline_updates(project_id=project_id, limit=limit)


@router.get("/platform-activities", response_model=List[PlatformActivity])
async def get_platform_activities(
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    """Fetch platform wide activities for Admin Console."""
    service = AuditService(db)
    return await service.get_platform_activities(limit=limit)


@router.get("/system-logs", response_model=List[SystemActivityLog])
async def get_system_logs(
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    """Fetch system activity logs for Admin Console."""
    service = AuditService(db)
    return await service.get_system_logs(limit=limit)
