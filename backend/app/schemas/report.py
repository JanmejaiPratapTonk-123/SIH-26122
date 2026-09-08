"""
Plan2Progress — Report Schemas.
Matches frontend SiteReport and SupervisorReport contracts.
"""

from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field
from app.schemas.common import BaseSchema


class SiteReportResponse(BaseSchema):
    id: str
    file_name: str = Field(..., alias="fileName")
    file_size: str = Field("0 KB", alias="fileSize")
    file_type: str = Field("pdf", alias="fileType")
    submitted_by: str = Field(..., alias="submittedBy")
    role: str = "Site Supervisor"
    date: str
    time: str = ""
    status: str = "Processed"
    review_count: Optional[int] = Field(None, alias="reviewCount")
    updates_found: int = Field(0, alias="updatesFound")


class ManpowerItem(BaseModel):
    trade: str
    count: int


class EquipmentItem(BaseModel):
    name: str
    count: int


class QuantityItem(BaseModel):
    item: str
    quantity: str
    unit: str
    chainage: Optional[str] = None
    match_activity: Optional[str] = Field(None, alias="matchActivity")
    match_confidence: Optional[float] = Field(None, alias="matchConfidence")


class PhotoItem(BaseModel):
    url: str
    caption: str
    geotag: str
    timestamp: str


class SupervisorReportCreate(BaseModel):
    project_id: str = Field(..., alias="projectId")
    work_area: str = Field(..., alias="workArea")
    chainage: str
    date: str
    shift: str
    weather: Optional[str] = "Clear"
    temperature: Optional[str] = "30°C"
    contractor: Optional[str] = ""
    manpower: List[ManpowerItem] = Field(default_factory=list)
    equipment: List[EquipmentItem] = Field(default_factory=list)
    quantities: List[QuantityItem] = Field(default_factory=list)
    photos: List[PhotoItem] = Field(default_factory=list)
    notes: Optional[str] = None


class SupervisorReportResponse(BaseSchema):
    id: str
    file_name: str = Field(..., alias="fileName")
    file_size: str = Field("0 KB", alias="fileSize")
    file_type: str = Field("pdf", alias="fileType")
    work_area: str = Field("", alias="workArea")
    chainage: str = ""
    submitted_by: str = Field(..., alias="submittedBy")
    role: str = "Site Supervisor"
    date: str
    time: str = ""
    status: str = "Processed"
    updates_count: int = Field(0, alias="updatesCount")
    contractor: str = ""
    weather: str = "Clear"
    temperature: str = "30°C"
    shift: str = "Day Shift #1"
    manpower: List[ManpowerItem] = Field(default_factory=list)
    equipment: List[EquipmentItem] = Field(default_factory=list)
    quantities: List[QuantityItem] = Field(default_factory=list)
    photos: List[PhotoItem] = Field(default_factory=list)
    notes: Optional[str] = None


class ReportUploadResponse(BaseSchema):
    report_id: str = Field(..., alias="reportId")
    file_name: str = Field(..., alias="fileName")
    file_size: str = Field(..., alias="fileSize")
    file_type: str = Field(..., alias="fileType")
    status: str
    events_extracted: int = Field(0, alias="eventsExtracted")
    message: str
