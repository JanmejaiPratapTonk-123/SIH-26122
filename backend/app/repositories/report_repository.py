"""
Plan2Progress — Progress Report & Event Repository.
"""

from typing import Optional, Sequence, List
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.models import ProgressReport, ProgressEvent
from app.repositories.base import BaseRepository


class ReportRepository(BaseRepository[ProgressReport]):
    def __init__(self, db: AsyncSession):
        super().__init__(ProgressReport, db)

    async def list_reports(
        self,
        project_id: Optional[uuid.UUID] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> Sequence[ProgressReport]:
        stmt = select(ProgressReport).options(
            selectinload(ProgressReport.events),
            selectinload(ProgressReport.submitted_by_user),
        )
        if project_id:
            stmt = stmt.where(ProgressReport.project_id == project_id)
        stmt = stmt.order_by(ProgressReport.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_with_events(self, report_id: uuid.UUID) -> Optional[ProgressReport]:
        stmt = (
            select(ProgressReport)
            .where(ProgressReport.id == report_id)
            .options(
                selectinload(ProgressReport.events),
                selectinload(ProgressReport.submitted_by_user),
            )
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def add_event(self, **kwargs) -> ProgressEvent:
        event = ProgressEvent(**kwargs)
        self.db.add(event)
        await self.db.flush()
        await self.db.refresh(event)
        return event

    async def get_events_for_report(self, report_id: uuid.UUID) -> Sequence[ProgressEvent]:
        stmt = (
            select(ProgressEvent)
            .where(ProgressEvent.report_id == report_id)
            .order_by(ProgressEvent.created_at.asc())
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()
