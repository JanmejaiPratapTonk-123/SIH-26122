"""
Plan2Progress — Audit Log Repository.
"""

from typing import Optional, Sequence, Dict, Any
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.models import AuditLog, User
from app.repositories.base import BaseRepository


class AuditRepository(BaseRepository[AuditLog]):
    def __init__(self, db: AsyncSession):
        super().__init__(AuditLog, db)

    async def log_action(
        self,
        action: str,
        entity_type: str,
        entity_id: Optional[str] = None,
        project_id: Optional[uuid.UUID] = None,
        user_id: Optional[uuid.UUID] = None,
        user_name: Optional[str] = None,
        role: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
    ) -> AuditLog:
        return await self.create(
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            project_id=project_id,
            user_id=user_id,
            user_name=user_name,
            role=role,
            details=details or {},
        )

    async def list_recent(
        self,
        project_id: Optional[uuid.UUID] = None,
        limit: int = 50,
    ) -> Sequence[AuditLog]:
        stmt = (
            select(AuditLog)
            .options(selectinload(AuditLog.user))
            .order_by(AuditLog.created_at.desc())
            .limit(limit)
        )
        if project_id:
            stmt = stmt.where(AuditLog.project_id == project_id)
        result = await self.db.execute(stmt)
        return result.scalars().all()
