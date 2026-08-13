from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, index=True)
    listing_id = Column(String, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    guest_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    check_in = Column(String, nullable=False)  # ISO Date string: YYYY-MM-DD
    check_out = Column(String, nullable=False)  # ISO Date string: YYYY-MM-DD
    guests = Column(Integer, nullable=False, default=1)
    nights = Column(Integer, nullable=False)
    subtotal = Column(Float, nullable=False)
    cleaning_fee = Column(Float, default=0.0)
    service_fee = Column(Float, default=0.0)
    total_price = Column(Float, nullable=False)
    status = Column(String, default="confirmed")  # confirmed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    listing = relationship("Listing", back_populates="bookings")
    guest = relationship("User", back_populates="bookings")
