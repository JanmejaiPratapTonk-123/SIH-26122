"""
Plan2Progress — Authentication & User Profile Schemas.
Matches frontend UserProfile and Auth contracts.
"""

from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from app.schemas.common import BaseSchema


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseSchema):
    access_token: str
    token_type: str = "bearer"
    user: "UserProfileResponse"


class TokenPayload(BaseModel):
    sub: str
    role: str
    role_type: str
    exp: Optional[int] = None


class UserProfileResponse(BaseSchema):
    id: str
    name: str
    email: str
    role: str
    role_type: str = Field(..., alias="roleType")
    department: str = ""
    assigned_project: str = Field("", alias="assignedProject")
    initials: str = ""
    avatar_color: str = Field("#004D40", alias="avatarColor")
    permissions: List[str] = Field(default_factory=list)
    disallowed_actions: Optional[List[str]] = Field(default=None, alias="disallowedActions")


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str
    role_type: str
    department: Optional[str] = ""
    initials: Optional[str] = ""
    avatar_color: Optional[str] = "#004D40"
    permissions: Optional[List[str]] = None
    disallowed_actions: Optional[List[str]] = None
    assigned_project_ids: Optional[List[str]] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None
    role_type: Optional[str] = None
    department: Optional[str] = None
    initials: Optional[str] = None
    avatar_color: Optional[str] = None
    status: Optional[str] = None
    permissions: Optional[List[str]] = None
    disallowed_actions: Optional[List[str]] = None
    assigned_project_ids: Optional[List[str]] = None


TokenResponse.model_rebuild()
