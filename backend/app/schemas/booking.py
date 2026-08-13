from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from app.schemas.listing import ListingResponse
from app.schemas.user import UserResponse

class BookingCreate(BaseModel):
    listing_id: str
    guest_id: str
    check_in: str = Field(..., description="Check-in date YYYY-MM-DD")
    check_out: str = Field(..., description="Check-out date YYYY-MM-DD")
    guests: int = Field(1, ge=1)

class BookingResponse(BaseModel):
    id: str
    listing_id: str
    guest_id: str
    check_in: str
    check_out: str
    guests: int
    nights: int
    subtotal: float
    cleaning_fee: float
    service_fee: float
    total_price: float
    status: str
    created_at: datetime
    listing: Optional[ListingResponse] = None
    guest: Optional[UserResponse] = None

    class Config:
        from_attributes = True

class DateRangeSchema(BaseModel):
    check_in: str
    check_out: str
