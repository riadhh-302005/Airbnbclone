import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/listings", tags=["reviews"])

@router.get("/{listing_id}/reviews", response_model=List[schemas.ReviewResponse])
def get_listing_reviews(listing_id: str, db: Session = Depends(get_db)):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    reviews = (
        db.query(models.Review)
        .filter(models.Review.listing_id == listing_id)
        .order_by(models.Review.created_at.desc())
        .all()
    )
    return reviews

@router.post("/{listing_id}/reviews", response_model=schemas.ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(listing_id: str, review_in: schemas.ReviewCreate, db: Session = Depends(get_db)):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    user = db.query(models.User).filter(models.User.id == review_in.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    rev_id = f"rev_{uuid.uuid4().hex[:8]}"
    db_review = models.Review(
        id=rev_id,
        listing_id=listing_id,
        user_id=review_in.user_id,
        rating=review_in.rating,
        comment=review_in.comment
    )
    db.add(db_review)
    db.commit()

    # Recalculate listing rating and count
    stats = (
        db.query(
            func.avg(models.Review.rating).label("avg_rating"),
            func.count(models.Review.id).label("count")
        )
        .filter(models.Review.listing_id == listing_id)
        .first()
    )

    if stats and stats.avg_rating is not None:
        listing.rating = round(float(stats.avg_rating), 2)
        listing.review_count = int(stats.count)
        db.commit()

    db.refresh(db_review)
    return db_review
