from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/host", tags=["host"])

@router.get("/listings", response_model=List[schemas.ListingResponse])
def get_host_listings(host_id: str = Query(...), db: Session = Depends(get_db)):
    listings = (
        db.query(models.Listing)
        .filter(models.Listing.host_id == host_id)
        .order_by(models.Listing.created_at.desc())
        .all()
    )
    return listings

@router.get("/bookings", response_model=List[schemas.BookingResponse])
def get_host_bookings(host_id: str = Query(...), db: Session = Depends(get_db)):
    # Find all listing IDs owned by host
    host_listing_ids = [
        l.id for l in db.query(models.Listing.id).filter(models.Listing.host_id == host_id).all()
    ]
    if not host_listing_ids:
        return []

    bookings = (
        db.query(models.Booking)
        .filter(models.Booking.listing_id.in_(host_listing_ids))
        .order_by(models.Booking.created_at.desc())
        .all()
    )
    return bookings

@router.get("/stats")
def get_host_stats(host_id: str = Query(...), db: Session = Depends(get_db)):
    host_listings = db.query(models.Listing).filter(models.Listing.host_id == host_id).all()
    total_listings = len(host_listings)

    listing_ids = [l.id for l in host_listings]
    if not listing_ids:
        return {
            "total_listings": 0,
            "total_bookings": 0,
            "total_revenue": 0.0,
            "occupancy_rate": 0
        }

    bookings = (
        db.query(models.Booking)
        .filter(models.Booking.listing_id.in_(listing_ids), models.Booking.status == "confirmed")
        .all()
    )
    total_bookings = len(bookings)
    total_revenue = sum(b.total_price for b in bookings)
    total_nights = sum(b.nights for b in bookings)
    # Estimate occupancy rate based on nights booked vs available listing capacity
    occupancy_rate = min(100, int((total_nights / (total_listings * 30 or 1)) * 100))

    return {
        "total_listings": total_listings,
        "total_bookings": total_bookings,
        "total_revenue": round(total_revenue, 2),
        "occupancy_rate": occupancy_rate
    }
