"""
Plan2Progress — Report Processing Service.

Coordinates file intake, deterministic event extraction, candidate matching,
and initial review queue generation.
"""

from typing import Optional, List, Dict, Any
import uuid
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.models import ProgressReport, ProgressEvent, ActivityMatch, Activity, Schedule
from app.repositories.report_repository import ReportRepository
from app.repositories.schedule_repository import ScheduleRepository
from app.repositories.audit_repository import AuditRepository
from app.services.extraction_service import DeterministicExtractionService, ExtractedEvent
from app.services.matching_service import DeterministicMatchingService


class ReportService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.report_repo = ReportRepository(db)
        self.schedule_repo = ScheduleRepository(db)
        self.audit_repo = AuditRepository(db)
        self.extractor = DeterministicExtractionService()
        self.matcher = DeterministicMatchingService()

    async def process_report(
        self,
        project_id: uuid.UUID,
        file_name: str,
        file_content: bytes,
        file_type: str,
        submitted_by_id: Optional[uuid.UUID] = None,
        submitted_by_name: str = "Site Supervisor",
        text_override: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> ProgressReport:
        """
        End-to-end report processing:
        1. Save report record
        2. Extract events
        3. Match to schedule activities
        4. Create ActivityMatch queue items
        5. Log audit trail
        """
        file_size_kb = len(file_content) / 1024
        file_size_str = f"{file_size_kb / 1024:.1f} MB" if file_size_kb >= 1024 else f"{int(file_size_kb)} KB"

        # 1. Create ProgressReport
        report = await self.report_repo.create(
            project_id=project_id,
            file_name=file_name,
            file_type=file_type,
            file_size=file_size_str,
            submitted_by=submitted_by_id,
            status="Processed",
        )

        # 2. Extract text (or use provided text)
        extracted_text = text_override or file_content.decode("utf-8", errors="ignore")
        events_data: List[ExtractedEvent] = self.extractor.extract_events(
            extracted_text, metadata=metadata
        )

        # 3. Retrieve schedule activities to match against
        schedule = await self.schedule_repo.get_by_project(project_id)
        activities: List[Activity] = []
        if schedule:
            acts = await self.schedule_repo.get_activities(schedule.id)
            activities = list(acts)

        # 4. Save events and match candidates
        created_events_count = 0
        matches_created = 0

        for ev in events_data:
            event = await self.report_repo.add_event(
                report_id=report.id,
                project_id=project_id,
                description=ev.description,
                reported_quantity=ev.quantity,
                reported_uom=ev.uom,
                location_corridor=ev.location_desc,
                chainage_start=ev.chainage_start,
                chainage_end=ev.chainage_end,
                execution_date=datetime.now(timezone.utc).date(),
                raw_quote=ev.raw_quote,
                extraction_confidence=ev.confidence,
            )
            created_events_count += 1

            if activities:
                scored_candidates = self.matcher.match_event_to_activities(event, activities, top_k=3)
                if scored_candidates:
                    top_candidate = scored_candidates[0]
                    # Format alternatives metadata
                    alt_data = [
                        {
                            "id": str(c.activity.id),
                            "title": c.activity.name,
                            "activityId": c.activity.activity_code,
                            "workPackage": c.activity.work_package or "General",
                            "matchPct": c.confidence,
                            "reason": c.rationale,
                            "plannedCorridor": f"{c.activity.corridor_start or ''} – {c.activity.corridor_finish or ''}".strip(" –"),
                        }
                        for c in scored_candidates[1:]
                    ]

                    match = ActivityMatch(
                        event_id=event.id,
                        activity_id=top_candidate.activity.id,
                        confidence_score=top_candidate.confidence,
                        match_rationale=top_candidate.rationale,
                        status="Pending",
                        alternative_candidates=alt_data,
                    )
                    self.db.add(match)
                    matches_created += 1

        # 5. Audit Log
        await self.audit_repo.log_action(
            action="REPORT_PROCESSED",
            entity_type="ProgressReport",
            entity_id=str(report.id),
            project_id=project_id,
            user_id=submitted_by_id,
            user_name=submitted_by_name,
            role="Site Supervisor",
            details={
                "fileName": file_name,
                "eventsCount": created_events_count,
                "matchesCreated": matches_created,
            },
        )

        await self.db.flush()
        await self.db.refresh(report)
        report.events_count = created_events_count
        return report
