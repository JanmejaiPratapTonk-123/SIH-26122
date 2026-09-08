"""
Plan2Progress — Projects Router.
"""

from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.repositories.project_repository import ProjectRepository
from app.repositories.schedule_repository import ScheduleRepository
from app.repositories.report_repository import ReportRepository
from app.services.review_service import ReviewService
from app.services.audit_service import AuditService
from app.models.models import Project, User
from app.schemas.project import AdminProject, ProjectCreate, ProjectUpdate, ProjectTeamMember
from app.schemas.schedule import ActivityResponse
from app.schemas.report import SiteReportResponse
from app.schemas.matching import ReviewQueueItem
from app.schemas.audit import TimelineUpdate

router = APIRouter(prefix="/projects", tags=["Projects"])


def _format_project(p: Project) -> AdminProject:
    team_members: List[ProjectTeamMember] = []
    if p.team_assignments:
        for a in p.team_assignments:
            if a.user:
                team_members.append(
                    ProjectTeamMember(
                        id=str(a.user.id),
                        name=a.user.name,
                        email=a.user.email,
                        role=a.user.role,
                        status=a.user.status,
                    )
                )

    return AdminProject(
        id=str(p.id),
        name=p.name,
        code=p.code,
        location=p.location or "Assam, India",
        manager=p.manager or "Unassigned",
        progress=p.progress_pct or 0.0,
        status=p.status or "On Track",
        users_count=len(team_members),
        open_issues=p.open_issues or 0,
        schedule_status=p.schedule_status or "Healthy",
        contractors_count=2,
        reports_this_month=14,
        assigned_users=team_members,
        start_date=p.start_date.isoformat() if p.start_date else "",
        target_completion=p.target_completion.isoformat() if p.target_completion else "",
        description=p.description or "",
    )


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


def _format_site_report(r) -> SiteReportResponse:
    time_str = r.created_at.strftime("%I:%M %p") if r.created_at else ""
    date_str = r.created_at.strftime("%d %b %Y") if r.created_at else "Today"
    author_name = r.submitted_by_user.name if (r.submitted_by_user) else "Site Supervisor"
    author_role = r.submitted_by_user.role if (r.submitted_by_user) else "Site Supervisor"
    events_count = len(r.events) if r.events else 0

    return SiteReportResponse(
        id=str(r.id),
        fileName=r.file_name,
        fileSize=r.file_size or "1.2 MB",
        fileType=r.file_type or "pdf",
        submittedBy=author_name,
        role=author_role,
        date=date_str,
        time=time_str,
        status=r.status or "Processed",
        reviewCount=3 if r.status == "Need Review" else None,
        updatesFound=events_count,
    )


@router.get("", response_model=List[AdminProject])
async def list_projects(db: AsyncSession = Depends(get_db)):
    """List all projects."""
    repo = ProjectRepository(db)
    projects = await repo.list_all_with_team()
    return [_format_project(p) for p in projects]


@router.get("/{project_id}", response_model=AdminProject)
async def get_project(project_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Get project by ID."""
    repo = ProjectRepository(db)
    p = await repo.get_with_team(project_id)
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    return _format_project(p)


@router.post("", response_model=AdminProject, status_code=status.HTTP_201_CREATED)
async def create_project(data: ProjectCreate, db: AsyncSession = Depends(get_db)):
    """Create a new project."""
    repo = ProjectRepository(db)
    existing = await repo.get_by_code(data.code)
    if existing:
        raise HTTPException(status_code=400, detail="Project code already exists")

    created = await repo.create(
        name=data.name,
        code=data.code,
        location=data.location,
        manager=data.manager,
        status=data.status,
        description=data.description,
    )
    return _format_project(created)


@router.get("/{project_id}/activities", response_model=List[ActivityResponse])
async def get_project_activities(project_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Get all schedule activities for a given project."""
    sched_repo = ScheduleRepository(db)
    schedule = await sched_repo.get_by_project(project_id)
    if not schedule:
        return []
    acts = await sched_repo.get_activities(schedule.id)
    return [_format_activity(a) for a in acts]


@router.get("/{project_id}/reports", response_model=List[SiteReportResponse])
async def get_project_reports(project_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Get all progress reports for a given project."""
    rep_repo = ReportRepository(db)
    reports = await rep_repo.list_reports(project_id=project_id)
    return [_format_site_report(r) for r in reports]


@router.get("/{project_id}/matches/pending", response_model=List[ReviewQueueItem])
async def get_project_pending_matches(project_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Get pending candidate matches for a project review queue."""
    service = ReviewService(db)
    return await service.get_review_queue(project_id=project_id)


@router.get("/{project_id}/audit-trail", response_model=List[TimelineUpdate])
async def get_project_audit_trail(project_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Get chronological audit trail / timeline updates for a project."""
    service = AuditService(db)
    return await service.get_timeline_updates(project_id=project_id)
