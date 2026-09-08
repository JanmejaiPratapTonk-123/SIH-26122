"""
Plan2Progress — Audit, Timeline, and Activity Log Schemas.
Matches frontend TimelineUpdate, PlatformActivity, SystemActivityLog, NeedsAttentionItem contracts.
"""

from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.common import BaseSchema


class TimelineUpdate(BaseSchema):
    id: str
    actor: str
    role: Optional[str] = None
    time: str
    detail: str
    file_badge: Optional[str] = Field(None, alias="fileBadge")
    badge_count: Optional[str] = Field(None, alias="badgeCount")
    dot_color: str = Field("primary", alias="dotColor")


class PlatformActivity(BaseSchema):
    id: str
    time: str
    title: str
    actor: str
    project: Optional[str] = None
    category: str
    detail: str
    status: Optional[str] = "Success"


class SystemActivityLog(BaseSchema):
    id: str
    time: str
    user: str
    action: str
    project: str
    result: str = "Success"
    detail: str


class NeedsAttentionItem(BaseSchema):
    id: str
    title: str
    subtitle: str
    location: str
    issue_type: str = Field(..., alias="issueType")
    issue_label: str = Field(..., alias="issueLabel")
    severity: str
    action_label: str = Field(..., alias="actionLabel")
    action_type: str = Field(..., alias="actionType")
