"""
Plan2Progress — Schedule and Activity Repository.
"""

from typing import Optional, Sequence, List
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload

from app.models.models import Schedule, Activity
from app.repositories.base import BaseRepository


class ScheduleRepository(BaseRepository[Schedule]):
    def __init__(self, db: AsyncSession):
        super().__init__(Schedule, db)

    async def get_by_project(self, project_id: uuid.UUID) -> Optional[Schedule]:
        stmt = (
            select(Schedule)
            .where(Schedule.project_id == project_id, Schedule.status == "Active")
            .options(selectinload(Schedule.activities))
            .order_by(Schedule.created_at.desc())
        )
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def get_activities(
        self,
        schedule_id: uuid.UUID,
        level: Optional[str] = None,
        work_package: Optional[str] = None,
    ) -> Sequence[Activity]:
        stmt = select(Activity).where(Activity.schedule_id == schedule_id)
        if level:
            stmt = stmt.where(Activity.level == level)
        if work_package:
            stmt = stmt.where(Activity.work_package == work_package)
        stmt = stmt.order_by(Activity.activity_code)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_activity_by_id(self, activity_id: uuid.UUID) -> Optional[Activity]:
        stmt = select(Activity).where(Activity.id == activity_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_activity_by_code(self, schedule_id: uuid.UUID, code: str) -> Optional[Activity]:
        stmt = select(Activity).where(
            Activity.schedule_id == schedule_id,
            Activity.activity_code == code
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_activity_by_code_any(self, code: str) -> Optional[Activity]:
        stmt = select(Activity).where(Activity.activity_code == code)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def update_activity_progress(
        self,
        activity_id: uuid.UUID,
        additional_quantity: float,
    ) -> Optional[Activity]:
        activity = await self.get_activity_by_id(activity_id)
        if not activity:
            return None

        new_actual = (activity.actual_quantity or 0.0) + additional_quantity
        planned = activity.planned_quantity or 0.0
        new_pct = min(100.0, round((new_actual / planned * 100.0) if planned > 0 else 100.0, 2))
        new_status = "Completed" if new_pct >= 100.0 else "In Progress"

        activity.actual_quantity = new_actual
        activity.progress_pct = new_pct
        activity.status = new_status

        await self.db.flush()
        await self.db.refresh(activity)
        return activity
