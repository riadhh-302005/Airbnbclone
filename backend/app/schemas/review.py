from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.user import UserResponse

class ReviewCreate(BaseModel):
    user_id: str
    rating: float = Field(..., ge=1.0, le=5.0)
    comment: str

class ReviewResponse(BaseModel):
    id: str
    listing_id: str
    user_id: str
    rating: float
    comment: str
    created_at: datetime
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True
