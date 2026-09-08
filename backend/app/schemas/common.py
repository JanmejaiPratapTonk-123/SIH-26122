"""
Plan2Progress — Common Pydantic Schemas.
"""

from typing import Generic, List, Optional, TypeVar
from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class PaginatedResponse(BaseSchema, Generic[T]):
    items: List[T]
    total: int
    page: int = 1
    page_size: int = 20
    total_pages: int = 1


class MessageResponse(BaseSchema):
    message: str
    success: bool = True
    detail: Optional[str] = None
