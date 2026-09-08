"""
Plan2Progress — Admin Console Schemas.
Matches frontend AdminUser, DataSourceItem, and AdminContractor contracts.
"""

from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from app.schemas.common import BaseSchema


class AdminUser(BaseSchema):
    id: str
    name: str
    email: str
    role: str
    role_type: str = Field(..., alias="roleType")
    assigned_projects: List[str] = Field(default_factory=list, alias="assignedProjects")
    status: str = "Active"
    last_active: str = Field("", alias="lastActive")


class DataSourceItem(BaseSchema):
    id: str
    name: str
    status: str = "Coming Soon"
    last_sync: str = Field("", alias="lastSync")
    records_processed: int = Field(0, alias="recordsProcessed")
    type: str = "API"
    description: str = ""


class DataSourceCreate(BaseModel):
    name: str
    source_type: str = Field("API", alias="sourceType")
    description: Optional[str] = None


class AdminContractor(BaseSchema):
    id: str
    name: str
    email: str
    project: str
    status: str = "Active"
    specialty: str = ""
    assigned_work: str = Field("", alias="assignedWork")
    reports_this_month: int = Field(0, alias="reportsThisMonth")
    active_workers: int = Field(0, alias="activeWorkers")


class AISettings(BaseSchema):
    confidence_threshold: float = Field(0.85, alias="confidenceThreshold")
    auto_approve_threshold: float = Field(0.95, alias="autoApproveThreshold")
    extraction_model: str = Field("deterministic-v1", alias="extractionModel")
    matching_model: str = Field("keyword-semantic-v1", alias="matchingModel")
    enable_auto_linking: bool = Field(True, alias="enableAutoLinking")
