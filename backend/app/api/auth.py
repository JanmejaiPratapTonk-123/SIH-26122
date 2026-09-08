"""
Plan2Progress — Authentication & User Profile Router.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.repositories.user_repository import UserRepository
from app.core.security import verify_password, create_access_token, get_current_user
from app.models.models import User
from app.schemas.auth import LoginRequest, TokenResponse, UserProfileResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


def _format_user_profile(user: User) -> UserProfileResponse:
    assigned_proj = ""
    if user.project_assignments:
        assigned_proj = user.project_assignments[0].project.name if user.project_assignments[0].project else ""

    return UserProfileResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role=user.role,
        role_type=user.role_type,
        department=user.department or "",
        assigned_project=assigned_proj,
        initials=user.initials or (user.name[:2].upper() if user.name else "U"),
        avatar_color=user.avatar_color or "#004D40",
        permissions=user.permissions if isinstance(user.permissions, list) else [],
        disallowed_actions=user.disallowed_actions if isinstance(user.disallowed_actions, list) else [],
    )


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Authenticate user and issue JWT bearer token."""
    repo = UserRepository(db)
    user = await repo.get_by_email(data.email)

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    token = create_access_token(
        data={"sub": str(user.id), "role": user.role, "role_type": user.role_type}
    )

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=_format_user_profile(user),
    )


@router.get("/me", response_model=UserProfileResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Return currently authenticated user profile."""
    return _format_user_profile(current_user)


@router.get("/users", response_model=List[UserProfileResponse])
async def list_default_users(db: AsyncSession = Depends(get_db)):
    """List available users (useful for role switcher in development/demo)."""
    repo = UserRepository(db)
    users = await repo.list_users(limit=20)
    return [_format_user_profile(u) for u in users]
