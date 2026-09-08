"""
Plan2Progress — Supervisor & DataSource Repositories.
"""

from typing import Optional, Sequence
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.models import ShiftNote, DataSource
from app.repositories.base import BaseRepository


class ShiftNoteRepository(BaseRepository[ShiftNote]):
    def __init__(self, db: AsyncSession):
        super().__init__(ShiftNote, db)

    async def list_by_project(
        self,
        project_id: uuid.UUID,
        skip: int = 0,
        limit: int = 100,
    ) -> Sequence[ShiftNote]:
        stmt = (
            select(ShiftNote)
            .where(ShiftNote.project_id == project_id)
            .order_by(ShiftNote.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()


class DataSourceRepository(BaseRepository[DataSource]):
    def __init__(self, db: AsyncSession):
        super().__init__(DataSource, db)

    async def list_all_sources(self) -> Sequence[DataSource]:
        stmt = select(DataSource).order_by(DataSource.name.asc())
        result = await self.db.execute(stmt)
        return result.scalars().all()
