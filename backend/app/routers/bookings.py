import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/bookings", tags=["bookings"])

def parse_date(date_str: str) -> datetime:
    try:
        return datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid date format for '{date_str}'. Use YYYY-MM-DD format."
        )

@router.post("", response_model=schemas.BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(booking_in: schemas.BookingCreate, db: Session = Depends(get_db)):
    # 1. Parse dates
    cin = parse_date(booking_in.check_in)
    cout = parse_date(booking_in.check_out)

    if cin >= cout:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Check-out date must be after check-in date"
        )

    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    if cin < today:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Check-in date cannot be in the past"
        )

    # 2. Check listing
    listing = db.query(models.Listing).filter(models.Listing.id == booking_in.listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    if booking_in.guests > listing.max_guests:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Guest count exceeds maximum limit of {listing.max_guests} for this listing"
        )

    # 3. Check guest user
    guest = db.query(models.User).filter(models.User.id == booking_in.guest_id).first()
    if not guest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Guest user not found")

    # 4. Check date overlap with existing confirmed bookings
    # Overlap formula: existing_check_in < requested_check_out AND existing_check_out > requested_check_in
    existing_bookings = (
        db.query(models.Booking)
        .filter(
            models.Booking.listing_id == booking_in.listing_id,
            models.Booking.status == "confirmed"
        )
        .all()
    )

    for ex in existing_bookings:
        ex_cin = parse_date(ex.check_in)
        ex_cout = parse_date(ex.check_out)
        if cin < ex_cout and cout > ex_cin:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Requested dates ({booking_in.check_in} to {booking_in.check_out}) overlap with an existing booking."
            )

    # 5. Calculate pricing
    nights = (cout - cin).days
    subtotal = round(nights * listing.price_per_night, 2)
    cleaning_fee = round(listing.cleaning_fee, 2)
    service_fee = round(listing.service_fee, 2)
    total_price = round(subtotal + cleaning_fee + service_fee, 2)

    booking_id = f"bk_{uuid.uuid4().hex[:8]}"
    db_booking = models.Booking(
        id=booking_id,
        listing_id=booking_in.listing_id,
        guest_id=booking_in.guest_id,
        check_in=booking_in.check_in,
        check_out=booking_in.check_out,
        guests=booking_in.guests,
        nights=nights,
        subtotal=subtotal,
        cleaning_fee=cleaning_fee,
        service_fee=service_fee,
        total_price=total_price,
        status="confirmed"
    )

    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@router.get("", response_model=List[schemas.BookingResponse])
def get_bookings(
    db: Session = Depends(get_db),
    guest_id: Optional[str] = None,
    listing_id: Optional[str] = None
):
    query = db.query(models.Booking)
    if guest_id:
        query = query.filter(models.Booking.guest_id == guest_id)
    if listing_id:
        query = query.filter(models.Booking.listing_id == listing_id)

    return query.order_by(models.Booking.created_at.desc()).all()

@router.get("/{booking_id}", response_model=schemas.BookingResponse)
def get_booking(booking_id: str, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    return booking

@router.delete("/{booking_id}", status_code=status.HTTP_200_OK)
def cancel_booking(booking_id: str, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    booking.status = "cancelled"
    db.commit()
    return {"message": "Booking cancelled successfully"}
