import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/listings", tags=["listings"])

@router.get("", response_model=List[schemas.ListingResponse])
def get_listings(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    location: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    property_type: Optional[str] = None,
    category: Optional[str] = None,
    guests: Optional[int] = None,
    bedrooms: Optional[int] = None,
    beds: Optional[int] = None,
    bathrooms: Optional[float] = None,
    amenities: Optional[List[str]] = Query(None),
    sort_by: Optional[str] = "recommended",
    page: int = 1,
    limit: int = 50,
):
    query = db.query(models.Listing)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                models.Listing.title.ilike(search_term),
                models.Listing.description.ilike(search_term),
                models.Listing.city.ilike(search_term),
                models.Listing.location.ilike(search_term),
                models.Listing.country.ilike(search_term),
            )
        )

    if location:
        loc_term = f"%{location}%"
        query = query.filter(
            or_(
                models.Listing.city.ilike(loc_term),
                models.Listing.location.ilike(loc_term),
                models.Listing.country.ilike(loc_term),
            )
        )

    if min_price is not None:
        query = query.filter(models.Listing.price_per_night >= min_price)

    if max_price is not None:
        query = query.filter(models.Listing.price_per_night <= max_price)

    p_type = property_type or category
    if p_type and p_type.lower() != "all" and p_type.lower() != "trending":
        query = query.filter(models.Listing.property_type.ilike(f"%{p_type}%"))

    if guests is not None and guests > 0:
        query = query.filter(models.Listing.max_guests >= guests)

    if bedrooms is not None and bedrooms > 0:
        query = query.filter(models.Listing.bedrooms >= bedrooms)

    if beds is not None and beds > 0:
        query = query.filter(models.Listing.beds >= beds)

    if bathrooms is not None and bathrooms > 0:
        query = query.filter(models.Listing.bathrooms >= bathrooms)

    if amenities:
        for amen_name in amenities:
            query = query.filter(
                models.Listing.amenities.any(models.Amenity.name.ilike(f"%{amen_name}%"))
            )

    if sort_by == "price_asc":
        query = query.order_by(models.Listing.price_per_night.asc())
    elif sort_by == "price_desc":
        query = query.order_by(models.Listing.price_per_night.desc())
    elif sort_by == "rating":
        query = query.order_by(models.Listing.rating.desc())
    else:
        query = query.order_by(models.Listing.created_at.desc())

    offset = (page - 1) * limit
    listings = query.offset(offset).limit(limit).all()
    return listings

@router.get("/{listing_id}", response_model=schemas.ListingResponse)
def get_listing(listing_id: str, db: Session = Depends(get_db)):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
    return listing

@router.get("/{listing_id}/availability", response_model=List[schemas.DateRangeSchema])
def get_listing_availability(listing_id: str, db: Session = Depends(get_db)):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    bookings = (
        db.query(models.Booking)
        .filter(models.Booking.listing_id == listing_id, models.Booking.status == "confirmed")
        .all()
    )

    return [{"check_in": b.check_in, "check_out": b.check_out} for b in bookings]

@router.post("", response_model=schemas.ListingResponse, status_code=status.HTTP_201_CREATED)
def create_listing(listing_in: schemas.ListingCreate, db: Session = Depends(get_db)):
    # Verify host exists
    host = db.query(models.User).filter(models.User.id == listing_in.host_id).first()
    if not host:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid host_id")

    listing_id = f"lst_{uuid.uuid4().hex[:8]}"
    db_listing = models.Listing(
        id=listing_id,
        host_id=listing_in.host_id,
        title=listing_in.title,
        description=listing_in.description,
        property_type=listing_in.property_type,
        location=listing_in.location,
        country=listing_in.country,
        city=listing_in.city,
        latitude=listing_in.latitude or 0.0,
        longitude=listing_in.longitude or 0.0,
        price_per_night=listing_in.price_per_night,
        cleaning_fee=listing_in.cleaning_fee,
        service_fee=listing_in.service_fee,
        max_guests=listing_in.max_guests,
        bedrooms=listing_in.bedrooms,
        beds=listing_in.beds,
        bathrooms=listing_in.bathrooms,
        rating=5.0,
        review_count=0
    )

    # Attach images
    for idx, img_url in enumerate(listing_in.images):
        img_id = f"img_{uuid.uuid4().hex[:8]}"
        db_listing.images.append(models.ListingImage(id=img_id, image_url=img_url, position=idx))

    # Attach amenities
    for amen_name in listing_in.amenities:
        amenity = db.query(models.Amenity).filter(models.Amenity.name.ilike(amen_name)).first()
        if not amenity:
            amenity_id = f"amen_{uuid.uuid4().hex[:8]}"
            amenity = models.Amenity(id=amenity_id, name=amen_name)
            db.add(amenity)
            db.flush()
        db_listing.amenities.append(amenity)

    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing

@router.put("/{listing_id}", response_model=schemas.ListingResponse)
def update_listing(listing_id: str, listing_in: schemas.ListingUpdate, db: Session = Depends(get_db)):
    db_listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not db_listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    update_data = listing_in.model_dump(exclude_unset=True)
    images_data = update_data.pop("images", None)
    amenities_data = update_data.pop("amenities", None)

    for field, val in update_data.items():
        setattr(db_listing, field, val)

    if images_data is not None:
        db.query(models.ListingImage).filter(models.ListingImage.listing_id == listing_id).delete()
        for idx, img_url in enumerate(images_data):
            img_id = f"img_{uuid.uuid4().hex[:8]}"
            db_listing.images.append(models.ListingImage(id=img_id, image_url=img_url, position=idx))

    if amenities_data is not None:
        db_listing.amenities.clear()
        for amen_name in amenities_data:
            amenity = db.query(models.Amenity).filter(models.Amenity.name.ilike(amen_name)).first()
            if not amenity:
                amenity_id = f"amen_{uuid.uuid4().hex[:8]}"
                amenity = models.Amenity(id=amenity_id, name=amen_name)
                db.add(amenity)
                db.flush()
            db_listing.amenities.append(amenity)

    db.commit()
    db.refresh(db_listing)
    return db_listing

@router.delete("/{listing_id}", status_code=status.HTTP_200_OK)
def delete_listing(listing_id: str, db: Session = Depends(get_db)):
    db_listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not db_listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    db.delete(db_listing)
    db.commit()
    return {"message": "Listing deleted successfully"}
