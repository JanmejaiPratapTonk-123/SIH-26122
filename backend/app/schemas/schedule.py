"""
Plan2Progress — Schedule and Activity Schemas.
"""

from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel, Field
from app.schemas.common import BaseSchema


class ActivityBase(BaseModel):
    activity_code: str = Field(..., alias="activityCode")
    name: str
    wbs_code: Optional[str] = Field(None, alias="wbsCode")
    work_package: Optional[str] = Field(None, alias="workPackage")
    level: str = "L5"
    planned_start: Optional[date] = Field(None, alias="plannedStart")
    planned_finish: Optional[date] = Field(None, alias="plannedFinish")
    planned_quantity: float = Field(0.0, alias="plannedQuantity")
    actual_quantity: float = Field(0.0, alias="actualQuantity")
    uom: str = "units"
    progress_pct: float = Field(0.0, alias="progressPct")
    status: str = "Not Started"
    corridor_start: Optional[str] = Field(None, alias="corridorStart")
    corridor_finish: Optional[str] = Field(None, alias="corridorFinish")
    is_critical: bool = Field(False, alias="isCritical")
    float_days: int = Field(0, alias="floatDays")
    remarks: Optional[str] = None


class ActivityCreate(ActivityBase):
    schedule_id: str = Field(..., alias="scheduleId")


class ActivityUpdate(BaseModel):
    name: Optional[str] = None
    wbs_code: Optional[str] = Field(None, alias="wbsCode")
    work_package: Optional[str] = Field(None, alias="workPackage")
    level: Optional[str] = None
    planned_start: Optional[date] = Field(None, alias="plannedStart")
    planned_finish: Optional[date] = Field(None, alias="plannedFinish")
    planned_quantity: Optional[float] = Field(None, alias="plannedQuantity")
    actual_quantity: Optional[float] = Field(None, alias="actualQuantity")
    uom: Optional[str] = None
    progress_pct: Optional[float] = Field(None, alias="progressPct")
    status: Optional[str] = None
    corridor_start: Optional[str] = Field(None, alias="corridorStart")
    corridor_finish: Optional[str] = Field(None, alias="corridorFinish")
    is_critical: Optional[bool] = Field(None, alias="isCritical")
    float_days: Optional[int] = Field(None, alias="floatDays")
    remarks: Optional[str] = None


class ActivityResponse(BaseSchema):
    id: str
    schedule_id: str = Field(..., alias="scheduleId")
    activity_code: str = Field(..., alias="activityCode")
    name: str
    wbs_code: Optional[str] = Field(None, alias="wbsCode")
    work_package: Optional[str] = Field(None, alias="workPackage")
    level: str = "L5"
    planned_start: Optional[date] = Field(None, alias="plannedStart")
    planned_finish: Optional[date] = Field(None, alias="plannedFinish")
    planned_quantity: float = Field(0.0, alias="plannedQuantity")
    actual_quantity: float = Field(0.0, alias="actualQuantity")
    uom: str = "units"
    progress_pct: float = Field(0.0, alias="progressPct")
    status: str = "Not Started"
    corridor_start: Optional[str] = Field(None, alias="corridorStart")
    corridor_finish: Optional[str] = Field(None, alias="corridorFinish")
    is_critical: bool = Field(False, alias="isCritical")
    float_days: int = Field(0, alias="floatDays")
    remarks: Optional[str] = None
    created_at: Optional[datetime] = Field(None, alias="createdAt")
    updated_at: Optional[datetime] = Field(None, alias="updatedAt")


class ScheduleResponse(BaseSchema):
    id: str
    project_id: str = Field(..., alias="projectId")
    file_name: str = Field(..., alias="fileName")
    file_type: str = Field(..., alias="fileType")
    version: int = 1
    total_activities: int = Field(0, alias="totalActivities")
    baseline_start: Optional[date] = Field(None, alias="baselineStart")
    baseline_finish: Optional[date] = Field(None, alias="baselineFinish")
    uploaded_by: Optional[str] = Field(None, alias="uploadedBy")
    status: str = "Active"
    created_at: Optional[datetime] = Field(None, alias="createdAt")
    activities: Optional[List[ActivityResponse]] = None
