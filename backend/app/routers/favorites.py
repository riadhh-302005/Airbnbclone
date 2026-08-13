import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/favorites", tags=["favorites"])

@router.get("", response_model=List[schemas.FavoriteResponse])
def get_favorites(user_id: str = Query(...), db: Session = Depends(get_db)):
    favs = db.query(models.Favorite).filter(models.Favorite.user_id == user_id).all()
    return favs

@router.post("/{listing_id}", response_model=schemas.FavoriteResponse, status_code=status.HTTP_201_CREATED)
def add_favorite(listing_id: str, user_id: str = Query(...), db: Session = Depends(get_db)):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    existing = (
        db.query(models.Favorite)
        .filter(models.Favorite.user_id == user_id, models.Favorite.listing_id == listing_id)
        .first()
    )
    if existing:
        return existing

    fav_id = f"fav_{uuid.uuid4().hex[:8]}"
    db_fav = models.Favorite(id=fav_id, user_id=user_id, listing_id=listing_id)
    db.add(db_fav)
    db.commit()
    db.refresh(db_fav)
    return db_fav

@router.delete("/{listing_id}", status_code=status.HTTP_200_OK)
def remove_favorite(listing_id: str, user_id: str = Query(...), db: Session = Depends(get_db)):
    existing = (
        db.query(models.Favorite)
        .filter(models.Favorite.user_id == user_id, models.Favorite.listing_id == listing_id)
        .first()
    )
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Favorite not found")

    db.delete(existing)
    db.commit()
    return {"message": "Favorite removed successfully"}
