"""
Plan2Progress — Activity Match Repository.
Handles candidate matches, review queue querying, approval, and rejection.
"""

from typing import Optional, Sequence, List
import uuid
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.models import ActivityMatch, ProgressEvent, Activity, ProgressReport
from app.repositories.base import BaseRepository


class MatchRepository(BaseRepository[ActivityMatch]):
    def __init__(self, db: AsyncSession):
        super().__init__(ActivityMatch, db)

    async def list_pending_matches(
        self,
        project_id: Optional[uuid.UUID] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> Sequence[ActivityMatch]:
        stmt = (
            select(ActivityMatch)
            .where(ActivityMatch.status == "Pending")
            .options(
                selectinload(ActivityMatch.event).selectinload(ProgressEvent.report),
                selectinload(ActivityMatch.activity),
            )
        )
        if project_id:
            stmt = stmt.join(ProgressEvent, ActivityMatch.event_id == ProgressEvent.id).where(
                ProgressEvent.project_id == project_id
            )
        stmt = stmt.order_by(ActivityMatch.confidence_score.desc()).offset(skip).limit(limit)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_with_details(self, match_id: uuid.UUID) -> Optional[ActivityMatch]:
        stmt = (
            select(ActivityMatch)
            .where(ActivityMatch.id == match_id)
            .options(
                selectinload(ActivityMatch.event).selectinload(ProgressEvent.report),
                selectinload(ActivityMatch.activity),
            )
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def approve_match(
        self,
        match_id: uuid.UUID,
        reviewed_by: uuid.UUID,
        selected_activity_id: Optional[uuid.UUID] = None,
        notes: Optional[str] = None,
    ) -> Optional[ActivityMatch]:
        match = await self.get_with_details(match_id)
        if not match:
            return None

        match.status = "Approved"
        match.reviewed_by = reviewed_by
        match.reviewed_at = datetime.now(timezone.utc)
        if selected_activity_id:
            match.activity_id = selected_activity_id
        if notes:
            match.reviewer_notes = notes

        await self.db.flush()
        await self.db.refresh(match)
        return match

    async def reject_match(
        self,
        match_id: uuid.UUID,
        reviewed_by: uuid.UUID,
        reason: str,
        notes: Optional[str] = None,
    ) -> Optional[ActivityMatch]:
        match = await self.get_with_details(match_id)
        if not match:
            return None

        match.status = "Rejected"
        match.reviewed_by = reviewed_by
        match.reviewed_at = datetime.now(timezone.utc)
        match.reviewer_notes = f"Reason: {reason}. {notes or ''}".strip()

        await self.db.flush()
        await self.db.refresh(match)
        return match
