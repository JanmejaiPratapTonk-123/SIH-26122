"""
Plan2Progress — Matching & Review Schemas.
Matches frontend ReviewQueueItem, ReviewCandidate, SuggestedActivity contracts.
"""

from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.common import BaseSchema


class ReviewCandidate(BaseSchema):
    id: str
    title: str
    activity_id: str = Field(..., alias="activityId")
    work_package: str = Field(..., alias="workPackage")
    match_pct: float = Field(..., alias="matchPct")
    reason: str
    planned_corridor: Optional[str] = Field(None, alias="plannedCorridor")


class SuggestedActivity(BaseSchema):
    title: str
    work_package: str = Field(..., alias="workPackage")
    activity_id: str = Field(..., alias="activityId")
    confidence: float
    match_rationale: str = Field(..., alias="matchRationale")
    highlight_corridor: Optional[str] = Field(None, alias="highlightCorridor")
    highlight_quantity: Optional[str] = Field(None, alias="highlightQuantity")
    scope_target: str = Field("0", alias="scopeTarget")
    current_done: str = Field("0", alias="currentDone")
    current_done_pct: float = Field(0.0, alias="currentDonePct")
    this_update_amount: str = Field("0", alias="thisUpdateAmount")
    this_update_pct: float = Field(0.0, alias="thisUpdatePct")
    after_approval: str = Field("0", alias="afterApproval")
    after_approval_pct: float = Field(0.0, alias="afterApprovalPct")
    unit: str = ""


class ReviewQueueItem(BaseSchema):
    id: str
    item_number: int = Field(1, alias="itemNumber")
    total_items: int = Field(1, alias="totalItems")
    sector: str = ""
    priority_tag: str = Field("", alias="priorityTag")
    source_doc: str = Field("", alias="sourceDoc")
    quote: str = ""
    submitted_by: str = Field("", alias="submittedBy")
    shift_info: str = Field("", alias="shiftInfo")
    corridor_location: str = Field("", alias="corridorLocation")
    corridor_sub: str = Field("", alias="corridorSub")
    reported_quantity: str = Field("", alias="reportedQuantity")
    quantity_detail: str = Field("", alias="quantityDetail")
    execution_date: str = Field("", alias="executionDate")
    shift_type: str = Field("", alias="shiftType")
    photo_url: str = Field("", alias="photoUrl")
    photo_geo_tag: str = Field("", alias="photoGeoTag")
    verified_tag: str = Field("", alias="verifiedTag")
    photo_title: str = Field("", alias="photoTitle")
    photo_desc: str = Field("", alias="photoDesc")
    attachment_meta: str = Field("", alias="attachmentMeta")
    suggested_activity: SuggestedActivity = Field(..., alias="suggestedActivity")
    alternatives: List[ReviewCandidate] = Field(default_factory=list)


class MatchApprovalRequest(BaseModel):
    selected_activity_id: Optional[str] = Field(None, description="Chosen activity ID if alternative selected")
    notes: Optional[str] = Field(None, description="Planner notes on approval")


class MatchRejectRequest(BaseModel):
    reason: str = Field(..., description="Reason for rejecting the candidate match")
    notes: Optional[str] = None


class MatchActionResponse(BaseSchema):
    match_id: str
    status: str
    activity_id: Optional[str] = None
    progress_updated: bool = False
    new_progress_pct: Optional[float] = None
    message: str
