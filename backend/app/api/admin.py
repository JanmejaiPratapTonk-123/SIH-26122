"""
Plan2Progress — System Admin Router.
Powers all sections of AdminConsoleScreen.
"""

from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.repositories.user_repository import UserRepository
from app.repositories.supervisor_repository import DataSourceRepository
from app.models.models import User, DataSource
from app.core.security import hash_password
from app.schemas.admin import (
    AdminUser,
    DataSourceItem,
    DataSourceCreate,
    AdminContractor,
    AISettings,
)
from app.schemas.auth import UserCreate

router = APIRouter(prefix="/admin", tags=["Admin Console"])


def _format_admin_user(u: User) -> AdminUser:
    assigned = []
    if u.project_assignments:
        assigned = [a.project.name for a in u.project_assignments if a.project]

    last_active_str = u.last_active_at.strftime("%I:%M %p") if u.last_active_at else "Today"

    return AdminUser(
        id=str(u.id),
        name=u.name,
        email=u.email,
        role=u.role,
        roleType=u.role_type,
        assignedProjects=assigned,
        status=u.status or "Active",
        lastActive=last_active_str,
    )


@router.get("/users", response_model=List[AdminUser])
async def list_admin_users(db: AsyncSession = Depends(get_db)):
    """List users for admin console management."""
    repo = UserRepository(db)
    users = await repo.list_users(limit=100)
    return [_format_admin_user(u) for u in users]


@router.post("/users", response_model=AdminUser, status_code=status.HTTP_201_CREATED)
async def create_admin_user(data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Create a new system user from admin console."""
    repo = UserRepository(db)
    existing = await repo.get_by_email(data.email)
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    user = await repo.create(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role=data.role,
        role_type=data.role_type,
        department=data.department,
        initials=data.initials,
        avatar_color=data.avatar_color,
        permissions=data.permissions or [],
        disallowed_actions=data.disallowed_actions or [],
    )
    return _format_admin_user(user)


@router.get("/contractors", response_model=List[AdminContractor])
async def list_contractors():
    """List turnkey and specialized contractors."""
    return [
        AdminContractor(
            id="cont-1",
            name="Kalpataru Field Ops",
            email="kalpataru.ops@infrastructure.in",
            project="Duliajan Gas Processing Plant",
            status="Active",
            specialty="Civil & Trenching",
            assignedWork="Sector B Corridor KP 10-25",
            reportsThisMonth=18,
            activeWorkers=142,
        ),
        AdminContractor(
            id="cont-2",
            name="ABC Engineering Pvt Ltd",
            email="progress@abc-engineering.com",
            project="Duliajan Gas Processing Plant",
            status="Active",
            specialty="Structural & Piping",
            assignedWork="Compressor Pad & Pipe Racks",
            reportsThisMonth=14,
            activeWorkers=98,
        ),
        AdminContractor(
            id="cont-3",
            name="L&T Hydrocarbon Engineering",
            email="duliajan.lead@lnt-hydrocarbon.com",
            project="Duliajan Gas Processing Plant",
            status="Active",
            specialty="EPC Turnkey",
            assignedWork="Gas Train & Turbines",
            reportsThisMonth=22,
            activeWorkers=310,
        ),
    ]


@router.get("/data-sources", response_model=List[DataSourceItem])
async def list_data_sources(db: AsyncSession = Depends(get_db)):
    """List configured external data sources and enterprise connectors."""
    repo = DataSourceRepository(db)
    sources = await repo.list_all_sources()
    if sources:
        return [
            DataSourceItem(
                id=str(s.id),
                name=s.name,
                status=s.status,
                lastSync=s.last_sync.strftime("%d %b %Y, %I:%M %p") if s.last_sync else "Never",
                recordsProcessed=s.records_processed or 0,
                type=s.source_type or "API",
                description=s.description or "",
            )
            for s in sources
        ]

    # Defaults matching frontend adminMockData
    return [
        DataSourceItem(
            id="ds-1",
            name="Oracle Primavera P6 EPPM",
            status="Connected",
            lastSync="Today, 04:30 AM",
            recordsProcessed=1420,
            type="Enterprise Scheduling",
            description="Bi-directional XML/API sync for L4-L6 WBS and activity baselines.",
        ),
        DataSourceItem(
            id="ds-2",
            name="Autodesk BIM 360 / ACC",
            status="Connected",
            lastSync="Yesterday, 11:00 PM",
            recordsProcessed=840,
            type="Field Documentation",
            description="Automated ingestion of field inspection sheets and PDF markups.",
        ),
        DataSourceItem(
            id="ds-3",
            name="SAP S/4HANA Plant Maintenance",
            status="Syncing",
            lastSync="05 Sep 2026, 06:15 PM",
            recordsProcessed=320,
            type="ERP / Procurement",
            description="Material delivery manifests and equipment utilization logs.",
        ),
        DataSourceItem(
            id="ds-4",
            name="DroneDeploy Reality Capture",
            status="Coming Soon",
            lastSync="Not configured",
            recordsProcessed=0,
            type="Aerial Photogrammetry",
            description="Orthomosaic terrain models and volumetric earthwork tracking.",
        ),
    ]


@router.get("/ai-settings", response_model=AISettings)
async def get_ai_settings():
    """Get active AI extraction and semantic matching thresholds."""
    return AISettings(
        confidenceThreshold=85.0,
        autoApproveThreshold=95.0,
        extractionModel="deterministic-v1",
        matchingModel="keyword-semantic-v1",
        enableAutoLinking=True,
    )
