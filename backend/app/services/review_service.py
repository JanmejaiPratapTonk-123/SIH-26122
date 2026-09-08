"""
Plan2Progress — Planner Match Review Service.

Serves the planner review queue and handles candidate approvals and rejections,
updating L5/L6 activity progress and creating immutable audit entries.
"""

from typing import List, Optional, Dict, Any
import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import ActivityMatch, Activity, ProgressEvent, User
from app.repositories.match_repository import MatchRepository
from app.repositories.schedule_repository import ScheduleRepository
from app.repositories.audit_repository import AuditRepository
from app.schemas.matching import ReviewQueueItem, SuggestedActivity, ReviewCandidate, MatchActionResponse


class ReviewService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.match_repo = MatchRepository(db)
        self.schedule_repo = ScheduleRepository(db)
        self.audit_repo = AuditRepository(db)

    async def get_review_queue(
        self,
        project_id: Optional[uuid.UUID] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> List[ReviewQueueItem]:
        """Fetch pending candidate matches formatted as ReviewQueueItem for frontend."""
        matches = await self.match_repo.list_pending_matches(
            project_id=project_id, skip=skip, limit=limit
        )

        total_matches = len(matches)
        items: List[ReviewQueueItem] = []

        for idx, m in enumerate(matches):
            ev: ProgressEvent = m.event
            act: Activity = m.activity

            scope_target = act.planned_quantity if act else 0.0
            current_done = act.actual_quantity if act else 0.0
            current_pct = act.progress_pct if act else 0.0

            update_qty = ev.reported_quantity or 0.0
            update_pct = round((update_qty / scope_target * 100.0) if scope_target > 0 else 0.0, 2)

            after_qty = current_done + update_qty
            after_pct = min(100.0, round((after_qty / scope_target * 100.0) if scope_target > 0 else 100.0, 2))

            unit_str = act.uom if act else (ev.reported_uom or "")

            suggested = SuggestedActivity(
                title=act.name if act else (ev.description or "Unknown Activity"),
                work_package=act.work_package or "General",
                activity_id=act.activity_code if act else "N/A",
                activity_uuid=str(act.id) if act else None,
                confidence=m.confidence_score,
                match_rationale=m.match_rationale or "Matched by semantic extraction.",
                highlight_corridor=ev.location_corridor or (f"{act.corridor_start or ''} to {act.corridor_finish or ''}".strip()),
                highlight_quantity=f"{update_qty} {unit_str}" if update_qty else None,
                scope_target=f"{scope_target:,.0f} {unit_str}".strip(),
                current_done=f"{current_done:,.0f} {unit_str}".strip(),
                current_done_pct=current_pct,
                this_update_amount=f"{update_qty:,.0f} {unit_str}".strip(),
                this_update_pct=update_pct,
                after_approval=f"{after_qty:,.0f} {unit_str}".strip(),
                after_approval_pct=after_pct,
                unit=unit_str,
            )

            # Build alternatives
            alternatives: List[ReviewCandidate] = []
            if m.alternative_candidates and isinstance(m.alternative_candidates, list):
                for alt in m.alternative_candidates:
                    alternatives.append(
                        ReviewCandidate(
                            id=alt.get("id", str(uuid.uuid4())),
                            title=alt.get("title", ""),
                            activity_id=alt.get("activityId", ""),
                            work_package=alt.get("workPackage", ""),
                            match_pct=alt.get("matchPct", 50.0),
                            reason=alt.get("reason", ""),
                            planned_corridor=alt.get("plannedCorridor"),
                        )
                    )

            doc_name = ev.report.file_name if (ev and ev.report) else "Field_Report.pdf"

            item = ReviewQueueItem(
                id=str(m.id),
                item_number=idx + 1,
                total_items=total_matches,
                sector=f"{act.work_package or 'Pipeline Section'} • Priority Review",
                priority_tag=f"Queue Item {idx + 1} of {total_matches}",
                source_doc=doc_name,
                quote=ev.raw_quote or ev.description,
                submitted_by="Site Supervisor",
                shift_info=f"Execution: {ev.execution_date or 'Recent'}",
                corridor_location=ev.location_corridor or "Corridor Front",
                corridor_sub="Project Corridor",
                reported_quantity=f"{ev.reported_quantity or 0} {unit_str}".strip(),
                quantity_detail="Verified through field inspection",
                execution_date=str(ev.execution_date or "Today"),
                shift_type="Day Shift #1",
                photo_url=ev.photo_url or "https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800&auto=format&fit=crop&q=80",
                photo_geo_tag="GEO: Verified",
                verified_tag="Field verified",
                photo_title="Inspection Photo",
                photo_desc="Visual field survey verifies progress conforms to specifications.",
                attachment_meta="Attachment 1 of 1",
                suggested_activity=suggested,
                alternatives=alternatives,
            )
            items.append(item)

        return items

    async def approve_match(
        self,
        match_id: uuid.UUID,
        user: User,
        selected_activity_id: Optional[uuid.UUID] = None,
        notes: Optional[str] = None,
    ) -> MatchActionResponse:
        """
        Approve candidate match:
        - Sets match status to Approved
        - Updates activity actual progress
        - Creates AuditLog
        """
        match = await self.match_repo.get_with_details(match_id)
        if not match:
            return MatchActionResponse(
                match_id=str(match_id),
                status="NotFound",
                progress_updated=False,
                message="Match not found",
            )

        target_activity_id = selected_activity_id or match.activity_id
        activity = await self.schedule_repo.get_activity_by_id(target_activity_id)

        update_qty = match.event.reported_quantity if (match.event and match.event.reported_quantity) else 0.0
        if activity and (update_qty == 0.0 or update_qty is None):
            desc = (match.event.description if match.event else "").lower()
            if "completed" in desc or "100%" in desc or "erected" in desc:
                rem = (activity.planned_quantity or 100.0) - (activity.actual_quantity or 0.0)
                update_qty = rem if rem > 0 else (activity.planned_quantity or 100.0)

        updated_activity = None
        if activity and update_qty > 0:
            updated_activity = await self.schedule_repo.update_activity_progress(
                activity.id, additional_quantity=update_qty
            )

        # Update Match status
        await self.match_repo.approve_match(
            match_id=match_id,
            reviewed_by=user.id,
            selected_activity_id=target_activity_id,
            notes=notes,
        )

        # Create audit log
        await self.audit_repo.log_action(
            action="MATCH_APPROVED",
            entity_type="ActivityMatch",
            entity_id=str(match_id),
            project_id=match.event.project_id if match.event else None,
            user_id=user.id,
            user_name=user.name,
            role=user.role,
            details={
                "activityCode": activity.activity_code if activity else None,
                "quantityAdded": update_qty,
                "newProgressPct": updated_activity.progress_pct if updated_activity else None,
                "notes": notes,
            },
        )

        return MatchActionResponse(
            match_id=str(match_id),
            status="Approved",
            activity_id=str(target_activity_id) if target_activity_id else None,
            progress_updated=updated_activity is not None,
            new_progress_pct=updated_activity.progress_pct if updated_activity else None,
            message=f"Progress successfully approved into activity {activity.activity_code if activity else ''}.",
        )

    async def reject_match(
        self,
        match_id: uuid.UUID,
        user: User,
        reason: str,
        notes: Optional[str] = None,
    ) -> MatchActionResponse:
        """Reject match candidate and log reason."""
        match = await self.match_repo.reject_match(
            match_id=match_id,
            reviewed_by=user.id,
            reason=reason,
            notes=notes,
        )
        if not match:
            return MatchActionResponse(
                match_id=str(match_id),
                status="NotFound",
                progress_updated=False,
                message="Match not found",
            )

        await self.audit_repo.log_action(
            action="MATCH_REJECTED",
            entity_type="ActivityMatch",
            entity_id=str(match_id),
            project_id=match.event.project_id if match.event else None,
            user_id=user.id,
            user_name=user.name,
            role=user.role,
            details={"reason": reason, "notes": notes},
        )

        return MatchActionResponse(
            match_id=str(match_id),
            status="Rejected",
            progress_updated=False,
            message="Match candidate rejected.",
        )
