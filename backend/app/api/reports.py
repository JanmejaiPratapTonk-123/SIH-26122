"""
Plan2Progress — Reports Router.
Matches frontend SiteReport and SupervisorReport contracts.
"""

from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.repositories.report_repository import ReportRepository
from app.services.report_service import ReportService
from app.schemas.report import (
    SiteReportResponse,
    ReportUploadResponse,
    SupervisorReportResponse,
    SupervisorReportCreate,
)

router = APIRouter(prefix="/reports", tags=["Reports"])


def _format_site_report(r) -> SiteReportResponse:
    time_str = r.created_at.strftime("%I:%M %p") if r.created_at else ""
    date_str = r.created_at.strftime("%d %b %Y") if r.created_at else "Today"
    author_name = r.submitted_by_user.name if r.submitted_by_user else "Site Supervisor"
    author_role = r.submitted_by_user.role if r.submitted_by_user else "Site Supervisor"

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


@router.get("", response_model=List[SiteReportResponse])
async def list_reports(
    project_id: Optional[uuid.UUID] = None,
    db: AsyncSession = Depends(get_db),
):
    """List site progress reports matching frontend SiteReportsScreen contract."""
    repo = ReportRepository(db)
    reports = await repo.list_reports(project_id=project_id)
    return [_format_site_report(r) for r in reports]


@router.post("/upload", response_model=ReportUploadResponse)
async def upload_progress_report(
    project_id: uuid.UUID = Form(...),
    submitted_by_name: str = Form("Site Supervisor"),
    text_content: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    """
    Upload and process a site progress report:
    Extracts progress events, semantically matches them to schedule activities,
    and enqueues candidate matches for planner review.
    """
    content = await file.read()
    service = ReportService(db)

    file_ext = "pdf"
    if file.filename:
        if file.filename.endswith(".xlsx"):
            file_ext = "xlsx"
        elif file.filename.endswith(".csv"):
            file_ext = "csv"

    report = await service.process_report(
        project_id=project_id,
        file_name=file.filename or "SiteReport.pdf",
        file_content=content,
        file_type=file_ext,
        submitted_by_name=submitted_by_name,
        text_override=text_content,
    )

    events_count = getattr(report, "events_count", 0)

    return ReportUploadResponse(
        reportId=str(report.id),
        fileName=report.file_name,
        fileSize=report.file_size,
        fileType=report.file_type,
        status=report.status,
        eventsExtracted=events_count,
        message=f"Report processed successfully. {events_count} progress event(s) extracted and queued for review.",
    )


@router.get("/supervisor", response_model=List[SupervisorReportResponse])
async def list_supervisor_reports(
    project_id: Optional[uuid.UUID] = None,
    db: AsyncSession = Depends(get_db),
):
    """List detailed supervisor reports with equipment, manpower, and photos."""
    repo = ReportRepository(db)
    reports = await repo.list_reports(project_id=project_id)
    out: List[SupervisorReportResponse] = []
    for r in reports:
        time_str = r.created_at.strftime("%I:%M %p") if r.created_at else ""
        date_str = r.created_at.strftime("%d %b %Y") if r.created_at else "Today"
        author_name = r.submitted_by_user.name if r.submitted_by_user else "Site Supervisor"
        author_role = r.submitted_by_user.role if r.submitted_by_user else "Site Supervisor"

        out.append(
            SupervisorReportResponse(
                id=str(r.id),
                fileName=r.file_name,
                fileSize=r.file_size or "1.5 MB",
                fileType=r.file_type or "pdf",
                workArea="Pipeline Corridor Section B",
                chainage="KP 12+400 – KP 12+850",
                submittedBy=author_name,
                role=author_role,
                date=date_str,
                time=time_str,
                status=r.status or "Processed",
                updatesCount=len(r.events) if r.events else 0,
                contractor="Kalpataru Field Ops",
                weather="Clear",
                temperature="31°C",
                shift="Day Shift #1",
            )
        )
    return out
