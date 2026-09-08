"""
Plan2Progress — User Repository.
"""

from typing import Optional, Sequence, List
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.models import User, UserProject, Project
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, db: AsyncSession):
        super().__init__(User, db)

    async def get_by_email(self, email: str) -> Optional[User]:
        stmt = (
            select(User)
            .where(User.email == email)
            .options(selectinload(User.project_assignments).selectinload(UserProject.project))
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_with_projects(self, user_id: uuid.UUID) -> Optional[User]:
        stmt = (
            select(User)
            .where(User.id == user_id)
            .options(selectinload(User.project_assignments).selectinload(UserProject.project))
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_users(self, skip: int = 0, limit: int = 100) -> Sequence[User]:
        stmt = (
            select(User)
            .options(selectinload(User.project_assignments).selectinload(UserProject.project))
            .order_by(User.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()
