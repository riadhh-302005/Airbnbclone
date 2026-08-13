from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Text, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database import Base

listing_amenities = Table(
    "listing_amenities",
    Base.metadata,
    Column("listing_id", String, ForeignKey("listings.id", ondelete="CASCADE"), primary_key=True),
    Column("amenity_id", String, ForeignKey("amenities.id", ondelete="CASCADE"), primary_key=True),
)

class Listing(Base):
    __tablename__ = "listings"

    id = Column(String, primary_key=True, index=True)
    host_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    property_type = Column(String, nullable=False, index=True)  # Beachfront, Cabin, Villa, Apartment, etc.
    location = Column(String, nullable=False)
    country = Column(String, nullable=False)
    city = Column(String, nullable=False, index=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    price_per_night = Column(Float, nullable=False)
    cleaning_fee = Column(Float, default=0.0)
    service_fee = Column(Float, default=0.0)
    max_guests = Column(Integer, nullable=False, default=1)
    bedrooms = Column(Integer, nullable=False, default=1)
    beds = Column(Integer, nullable=False, default=1)
    bathrooms = Column(Float, nullable=False, default=1.0)
    rating = Column(Float, default=5.0)
    review_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    host = relationship("User", back_populates="listings")
    images = relationship("ListingImage", back_populates="listing", cascade="all, delete-orphan", order_by="ListingImage.position")
    amenities = relationship("Amenity", secondary=listing_amenities, back_populates="listings")
    bookings = relationship("Booking", back_populates="listing", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="listing", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="listing", cascade="all, delete-orphan")

class ListingImage(Base):
    __tablename__ = "listing_images"

    id = Column(String, primary_key=True, index=True)
    listing_id = Column(String, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String, nullable=False)
    position = Column(Integer, default=0)

    listing = relationship("Listing", back_populates="images")

class Amenity(Base):
    __tablename__ = "amenities"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    icon = Column(String, nullable=True)

    listings = relationship("Listing", secondary=listing_amenities, back_populates="amenities")
