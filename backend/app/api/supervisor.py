"""
Plan2Progress — Supervisor Field Notes & Updates Router.
"""

from typing import List, Optional
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.core.security import get_current_user
from app.models.models import User, ShiftNote
from app.repositories.supervisor_repository import ShiftNoteRepository
from app.repositories.audit_repository import AuditRepository
from app.schemas.supervisor import SupervisorShiftNote, ShiftNoteCreate, SupervisorFieldUpdate

router = APIRouter(prefix="/supervisor", tags=["Supervisor"])


def _format_note(n: ShiftNote) -> SupervisorShiftNote:
    return SupervisorShiftNote(
        id=str(n.id),
        timestamp=n.created_at.strftime("%I:%M %p") if n.created_at else "",
        date=n.note_date.isoformat() if n.note_date else (n.created_at.strftime("%d %b %Y") if n.created_at else "Today"),
        chainage=n.chainage or "",
        category=n.category or "Observation",
        content=n.content,
        author=n.author_name or "Site Supervisor",
        photoUrl=n.photo_url,
        photoCaption=n.photo_caption,
    )


@router.get("/notes", response_model=List[SupervisorShiftNote])
async def list_shift_notes(
    project_id: uuid.UUID,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """List field shift notes for a project."""
    repo = ShiftNoteRepository(db)
    notes = await repo.list_by_project(project_id, skip=skip, limit=limit)
    return [_format_note(n) for n in notes]


@router.post("/notes", response_model=SupervisorShiftNote, status_code=status.HTTP_201_CREATED)
async def create_shift_note(
    data: ShiftNoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new supervisor field observation note."""
    repo = ShiftNoteRepository(db)
    audit_repo = AuditRepository(db)

    proj_id = uuid.UUID(data.project_id)
    note = await repo.create(
        project_id=proj_id,
        author_id=current_user.id,
        author_name=current_user.name,
        chainage=data.chainage,
        category=data.category,
        content=data.content,
        photo_url=data.photo_url,
        photo_caption=data.photo_caption,
        note_date=datetime.now(timezone.utc).date(),
    )

    await audit_repo.log_action(
        action="SHIFT_NOTE_CREATED",
        entity_type="ShiftNote",
        entity_id=str(note.id),
        project_id=proj_id,
        user_id=current_user.id,
        user_name=current_user.name,
        role=current_user.role,
        details={"category": data.category, "chainage": data.chainage},
    )

    return _format_note(note)


@router.get("/updates", response_model=List[SupervisorFieldUpdate])
async def list_supervisor_field_updates(
    project_id: Optional[uuid.UUID] = None,
    db: AsyncSession = Depends(get_db),
):
    """List recent field updates mapped to activities."""
    # Returns default supervisor updates structure matching frontend contract
    return [
        SupervisorFieldUpdate(
            id="sup-upd-1",
            reportId="rep-1",
            reportName="DPR_06_Sep_2026.pdf",
            activityId="L6-PIPE-EXC-042",
            activityName="Pipeline Trench Excavation",
            workPackage="Pipeline → Trench Excavation",
            chainage="KP 12+400 – KP 12+850",
            quantity="450",
            unit="m",
            trade="Excavation",
            status="Approved into P6",
            confidence=96.8,
            timestamp="10:42 AM",
            contractor="Kalpataru Field Ops",
        ),
        SupervisorFieldUpdate(
            id="sup-upd-2",
            reportId="rep-2",
            reportName="Contractor_Progress_W36.xlsx",
            activityId="L4-CIV-COMP-012",
            activityName="Compressor Foundation Concreting",
            workPackage="Civil Works → Compressor Station",
            chainage="Pad TB-02",
            quantity="180",
            unit="m³",
            trade="Civil",
            status="Under Review",
            confidence=94.2,
            timestamp="04:20 PM",
            contractor="ABC Engineering",
        ),
    ]
