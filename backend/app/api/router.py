"""
Plan2Progress — Master API v1 Router.
"""

from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.projects import router as projects_router
from app.api.schedules import router as schedules_router
from app.api.reports import router as reports_router
from app.api.matches import router as matches_router
from app.api.audit import router as audit_router
from app.api.supervisor import router as supervisor_router
from app.api.admin import router as admin_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router)
api_router.include_router(projects_router)
api_router.include_router(schedules_router)
api_router.include_router(reports_router)
api_router.include_router(matches_router)
api_router.include_router(audit_router)
api_router.include_router(supervisor_router)
api_router.include_router(admin_router)
