"""
Plan2Progress — Schedules & Activities Router.
"""

from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.repositories.schedule_repository import ScheduleRepository
from app.services.schedule_service import ScheduleService
from app.schemas.schedule import ScheduleResponse, ActivityResponse

router = APIRouter(tags=["Schedules & Activities"])


def _format_activity(act) -> ActivityResponse:
    return ActivityResponse(
        id=str(act.id),
        scheduleId=str(act.schedule_id),
        activityCode=act.activity_code,
        name=act.name,
        wbsCode=act.wbs_code,
        workPackage=act.work_package,
        level=act.level or "L5",
        plannedStart=act.planned_start,
        plannedFinish=act.planned_finish,
        plannedQuantity=act.planned_quantity or 0.0,
        actualQuantity=act.actual_quantity or 0.0,
        uom=act.uom or "units",
        progressPct=act.progress_pct or 0.0,
        status=act.status or "Not Started",
        corridorStart=act.corridor_start,
        corridorFinish=act.corridor_finish,
        isCritical=act.is_critical or False,
        floatDays=act.float_days or 0,
        remarks=act.remarks,
        createdAt=act.created_at,
        updatedAt=act.updated_at,
    )


@router.post("/projects/{project_id}/schedules/upload", response_model=ScheduleResponse)
async def upload_schedule(
    project_id: uuid.UUID,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    """Upload and ingest a project schedule CSV file."""
    content = await file.read()
    service = ScheduleService(db)
    schedule = await service.ingest_schedule_from_csv(
        project_id=project_id,
        file_name=file.filename or "Schedule.csv",
        content=content,
    )
    return ScheduleResponse(
        id=str(schedule.id),
        projectId=str(schedule.project_id),
        fileName=schedule.file_name,
        fileType=schedule.file_type,
        version=schedule.version or 1,
        totalActivities=schedule.total_activities or 0,
        baselineStart=schedule.baseline_start,
        baselineFinish=schedule.baseline_finish,
        uploadedBy=schedule.uploaded_by,
        status=schedule.status,
        createdAt=schedule.created_at,
    )


@router.get("/projects/{project_id}/schedule", response_model=ScheduleResponse)
async def get_active_schedule(project_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Get active schedule for a project including its activities."""
    repo = ScheduleRepository(db)
    schedule = await repo.get_by_project(project_id)
    if not schedule:
        raise HTTPException(status_code=404, detail="No active schedule found for project")

    activities = [_format_activity(a) for a in (schedule.activities or [])]
    return ScheduleResponse(
        id=str(schedule.id),
        projectId=str(schedule.project_id),
        fileName=schedule.file_name,
        fileType=schedule.file_type,
        version=schedule.version or 1,
        totalActivities=len(activities),
        baselineStart=schedule.baseline_start,
        baselineFinish=schedule.baseline_finish,
        uploadedBy=schedule.uploaded_by,
        status=schedule.status,
        createdAt=schedule.created_at,
        activities=activities,
    )


@router.get("/schedules/{schedule_id}/activities", response_model=List[ActivityResponse])
async def list_schedule_activities(
    schedule_id: uuid.UUID,
    level: Optional[str] = None,
    work_package: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """List activities for a schedule, with optional level or work package filters."""
    repo = ScheduleRepository(db)
    acts = await repo.get_activities(schedule_id, level=level, work_package=work_package)
    return [_format_activity(a) for a in acts]
