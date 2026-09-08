"""
Plan2Progress — Schedule Ingestion Service.

Parses schedule files (CSV, XLSX) and creates L5/L6 activities.
"""

from typing import List, Dict, Any, Optional
import uuid
import io
import csv
from datetime import datetime, date
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import Schedule, Activity
from app.repositories.schedule_repository import ScheduleRepository


class ScheduleService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = ScheduleRepository(db)

    async def ingest_schedule_from_csv(
        self,
        project_id: uuid.UUID,
        file_name: str,
        content: bytes,
        uploaded_by: Optional[str] = None,
    ) -> Schedule:
        """Parse CSV content and create Schedule + Activities."""
        schedule = await self.repo.create(
            project_id=project_id,
            file_name=file_name,
            file_type="csv",
            uploaded_by=uploaded_by or "System",
            status="Active",
        )

        # Read CSV rows
        text_stream = io.StringIO(content.decode("utf-8", errors="ignore"))
        reader = csv.DictReader(text_stream)

        count = 0
        for row in reader:
            activity_code = row.get("activity_code") or row.get("Activity ID") or f"ACT-{count+1:03d}"
            name = row.get("name") or row.get("Activity Name") or "Untitled Activity"
            wbs_code = row.get("wbs_code") or row.get("WBS")
            work_package = row.get("work_package") or row.get("Work Package") or "General"
            level = row.get("level") or "L5"
            planned_qty_raw = row.get("planned_quantity") or row.get("Planned Qty") or "0"
            uom = row.get("uom") or row.get("UOM") or "units"
            corridor_start = row.get("corridor_start") or row.get("Chainage Start")
            corridor_finish = row.get("corridor_finish") or row.get("Chainage End")

            try:
                planned_qty = float(planned_qty_raw)
            except ValueError:
                planned_qty = 0.0

            activity = Activity(
                schedule_id=schedule.id,
                activity_code=activity_code,
                name=name,
                wbs_code=wbs_code,
                work_package=work_package,
                level=level,
                planned_quantity=planned_qty,
                actual_quantity=0.0,
                uom=uom,
                progress_pct=0.0,
                status="Not Started",
                corridor_start=corridor_start,
                corridor_finish=corridor_finish,
            )
            self.db.add(activity)
            count += 1

        schedule.total_activities = count
        await self.db.flush()
        await self.db.refresh(schedule)
        return schedule
