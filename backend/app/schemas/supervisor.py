"""
Plan2Progress — Supervisor Field Notes & Updates Schemas.
Matches frontend SupervisorShiftNote and SupervisorFieldUpdate contracts.
"""

from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.common import BaseSchema


class SupervisorShiftNote(BaseSchema):
    id: str
    timestamp: str = ""
    date: str = ""
    chainage: str = ""
    category: str = "Observation"
    content: str
    author: str = ""
    photo_url: Optional[str] = Field(None, alias="photoUrl")
    photo_caption: Optional[str] = Field(None, alias="photoCaption")


class ShiftNoteCreate(BaseModel):
    project_id: str = Field(..., alias="projectId")
    chainage: Optional[str] = ""
    category: str = "Observation"
    content: str
    photo_url: Optional[str] = Field(None, alias="photoUrl")
    photo_caption: Optional[str] = Field(None, alias="photoCaption")


class SupervisorFieldUpdate(BaseSchema):
    id: str
    report_id: str = Field(..., alias="reportId")
    report_name: str = Field(..., alias="reportName")
    activity_id: str = Field(..., alias="activityId")
    activity_name: str = Field(..., alias="activityName")
    work_package: str = Field(..., alias="workPackage")
    chainage: str = ""
    quantity: str = ""
    unit: str = ""
    trade: str = ""
    status: str = "Pending AI Match"
    confidence: float = 0.0
    timestamp: str = ""
    contractor: str = ""
