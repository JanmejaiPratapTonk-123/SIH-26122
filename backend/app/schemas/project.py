"""
Plan2Progress — Project Schemas.
Matches frontend AdminProject and ProjectTeamMember contracts.
"""

from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.common import BaseSchema


class ProjectTeamMember(BaseSchema):
    id: str
    name: str
    email: str
    role: str
    status: str = "Active"


class ProjectBase(BaseModel):
    name: str
    code: str
    location: str
    manager: str
    status: str = "On Track"
    start_date: Optional[str] = Field(None, alias="startDate")
    target_completion: Optional[str] = Field(None, alias="targetCompletion")
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    location: Optional[str] = None
    manager: Optional[str] = None
    status: Optional[str] = None
    start_date: Optional[str] = Field(None, alias="startDate")
    target_completion: Optional[str] = Field(None, alias="targetCompletion")
    progress: Optional[float] = None
    schedule_status: Optional[str] = Field(None, alias="scheduleStatus")
    open_issues: Optional[int] = Field(None, alias="openIssues")
    description: Optional[str] = None


class AdminProject(BaseSchema):
    id: str
    name: str
    code: str
    location: str
    manager: str
    progress: float = 0.0
    status: str = "On Track"
    users_count: int = Field(0, alias="usersCount")
    open_issues: int = Field(0, alias="openIssues")
    schedule_status: str = Field("Healthy", alias="scheduleStatus")
    contractors_count: int = Field(0, alias="contractorsCount")
    reports_this_month: int = Field(0, alias="reportsThisMonth")
    assigned_users: List[ProjectTeamMember] = Field(default_factory=list, alias="assignedUsers")
    start_date: str = Field("", alias="startDate")
    target_completion: str = Field("", alias="targetCompletion")
    description: Optional[str] = None
