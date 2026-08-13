from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.schemas.listing import ListingResponse

class FavoriteCreate(BaseModel):
    user_id: str
    listing_id: str

class FavoriteResponse(BaseModel):
    id: str
    user_id: str
    listing_id: str
    created_at: datetime
    listing: Optional[ListingResponse] = None

    class Config:
        from_attributes = True
