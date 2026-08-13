from app.database import SessionLocal
from app import models
from app.seed import seed_db

db = SessionLocal()

# Delete tables in order
db.execute(models.listing_amenities.delete())
db.query(models.ListingImage).delete()
db.query(models.Booking).delete()
db.query(models.Review).delete()
db.query(models.Favorite).delete()
db.query(models.Listing).delete()
db.query(models.Amenity).delete()
db.query(models.User).delete()
db.commit()
db.close()

print("Cleared database completely for fresh seeding...")
seed_db()
print("Re-seeding completed with all 24+ hotels, villas, and homes!")
