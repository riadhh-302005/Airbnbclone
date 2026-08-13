from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import listings, bookings, reviews, favorites, users, host
from app.seed import seed_db

# Create database tables
Base.metadata.create_all(bind=engine)

# Seed database with sample data
seed_db()

app = FastAPI(
    title="Airbnb Clone API",
    description="Backend API for Airbnb Clone application built with FastAPI, SQLAlchemy, and SQLite",
    version="1.0.0"
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(listings.router)
app.include_router(bookings.router)
app.include_router(reviews.router)
app.include_router(favorites.router)
app.include_router(users.router)
app.include_router(host.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Airbnb Clone API",
        "docs": "/docs",
        "status": "online"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
