from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from app.schemas.user import UserResponse

class AmenitySchema(BaseModel):
    id: str
    name: str
    icon: Optional[str] = None

    class Config:
        from_attributes = True

class ListingImageSchema(BaseModel):
    id: str
    image_url: str
    position: int = 0

    class Config:
        from_attributes = True

class ListingBase(BaseModel):
    title: str
    description: str
    property_type: str
    location: str
    country: str
    city: str
    latitude: Optional[float] = 0.0
    longitude: Optional[float] = 0.0
    price_per_night: float
    cleaning_fee: float = 0.0
    service_fee: float = 0.0
    max_guests: int = 1
    bedrooms: int = 1
    beds: int = 1
    bathrooms: float = 1.0

class ListingCreate(ListingBase):
    host_id: str
    images: List[str] = []  # Image URLs
    amenities: List[str] = []  # Amenity names or IDs

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    property_type: Optional[str] = None
    location: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    price_per_night: Optional[float] = None
    cleaning_fee: Optional[float] = None
    service_fee: Optional[float] = None
    max_guests: Optional[int] = None
    bedrooms: Optional[int] = None
    beds: Optional[int] = None
    bathrooms: Optional[float] = None
    images: Optional[List[str]] = None
    amenities: Optional[List[str]] = None

class ListingResponse(ListingBase):
    id: str
    host_id: str
    rating: float = 5.0
    review_count: int = 0
    created_at: datetime
    images: List[ListingImageSchema] = []
    amenities: List[AmenitySchema] = []
    host: Optional[UserResponse] = None

    class Config:
        from_attributes = True
