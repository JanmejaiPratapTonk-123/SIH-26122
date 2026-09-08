"""
Plan2Progress — Candidate Matches & Review Queue Router.
Directly powers the MatchReviewScreen.
"""

from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.core.security import get_current_user
from app.models.models import User
from app.services.review_service import ReviewService
from app.schemas.matching import (
    ReviewQueueItem,
    MatchApprovalRequest,
    MatchRejectRequest,
    MatchActionResponse,
)

router = APIRouter(prefix="/matches", tags=["Candidate Matching & Review Queue"])


@router.get("/queue", response_model=List[ReviewQueueItem])
async def get_review_queue(
    project_id: Optional[uuid.UUID] = None,
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    """
    Get all pending candidate matches formatted as ReviewQueueItem
    for the MatchReviewScreen.
    """
    service = ReviewService(db)
    return await service.get_review_queue(project_id=project_id, skip=skip, limit=limit)


@router.post("/{match_id}/approve", response_model=MatchActionResponse)
async def approve_match(
    match_id: uuid.UUID,
    data: Optional[MatchApprovalRequest] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Approve candidate match into schedule activity:
    Updates activity actual progress, updates match status to Approved,
    and logs immutable audit event.
    """
    service = ReviewService(db)
    selected_act_id = uuid.UUID(data.selected_activity_id) if (data and data.selected_activity_id) else None
    notes = data.notes if data else None

    return await service.approve_match(
        match_id=match_id,
        user=current_user,
        selected_activity_id=selected_act_id,
        notes=notes,
    )


@router.post("/{match_id}/reject", response_model=MatchActionResponse)
async def reject_match(
    match_id: uuid.UUID,
    data: MatchRejectRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Reject candidate match and record rejection rationale.
    """
    service = ReviewService(db)
    return await service.reject_match(
        match_id=match_id,
        user=current_user,
        reason=data.reason,
        notes=data.notes,
    )
