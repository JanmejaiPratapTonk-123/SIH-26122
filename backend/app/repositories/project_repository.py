"""
Plan2Progress — Project Repository.
"""

from typing import Optional, Sequence
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.models.models import Project, UserProject, User
from app.repositories.base import BaseRepository


class ProjectRepository(BaseRepository[Project]):
    def __init__(self, db: AsyncSession):
        super().__init__(Project, db)

    async def get_by_code(self, code: str) -> Optional[Project]:
        stmt = (
            select(Project)
            .where(Project.code == code)
            .options(selectinload(Project.team_assignments).selectinload(UserProject.user))
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_with_team(self, project_id: uuid.UUID) -> Optional[Project]:
        stmt = (
            select(Project)
            .where(Project.id == project_id)
            .options(selectinload(Project.team_assignments).selectinload(UserProject.user))
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_all_with_team(self, skip: int = 0, limit: int = 100) -> Sequence[Project]:
        stmt = (
            select(Project)
            .options(selectinload(Project.team_assignments).selectinload(UserProject.user))
            .order_by(Project.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()
