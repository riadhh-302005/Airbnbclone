from datetime import datetime, timedelta
import random
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app import models

def seed_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Check if already seeded
        if db.query(models.User).filter(models.User.id == "usr_host_1").first():
            print("Database already seeded. Skipping.")
            return

        print("Seeding database with initial data...")

        # 1. Users
        users = [
            models.User(
                id="usr_host_1",
                name="Ria",
                email="ria@example.com",
                avatar="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
                role="host",
                created_at=datetime.utcnow() - timedelta(days=365)
            ),
            models.User(
                id="usr_host_2",
                name="Marcus Vance",
                email="marcus.vance@example.com",
                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                role="host",
                created_at=datetime.utcnow() - timedelta(days=200)
            ),
            models.User(
                id="usr_host_3",
                name="Elena Rostova",
                email="elena.rostova@example.com",
                avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                role="host",
                created_at=datetime.utcnow() - timedelta(days=150)
            ),
            models.User(
                id="usr_guest_1",
                name="Ranjot",
                email="ranjot@example.com",
                avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
                role="guest",
                created_at=datetime.utcnow() - timedelta(days=90)
            ),
            models.User(
                id="usr_guest_2",
                name="Emily Chen",
                email="emily.chen@example.com",
                avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                role="guest",
                created_at=datetime.utcnow() - timedelta(days=60)
            ),
        ]
        db.add_all(users)
        db.commit()

        # 2. Amenities
        amenities_data = [
            ("amen_wifi", "Wifi", "wifi"),
            ("amen_ac", "Air conditioning", "wind"),
            ("amen_pool", "Pool", "waves"),
            ("amen_parking", "Free parking", "car"),
            ("amen_kitchen", "Kitchen", "utensils"),
            ("amen_tub", "Hot tub", "bath"),
            ("amen_patio", "Patio or balcony", "sun"),
            ("amen_beach", "Beach access", "umbrella"),
            ("amen_ev", "EV charger", "zap"),
            ("amen_mountain", "Mountain view", "mountain"),
            ("amen_workspace", "Dedicated workspace", "laptop"),
            ("amen_bbq", "BBQ grill", "flame"),
            ("amen_fireplace", "Fireplace", "flame"),
            ("amen_tv", "TV", "tv"),
            ("amen_washer", "Washer", "washing-machine"),
        ]
        amenities_dict = {}
        for a_id, a_name, a_icon in amenities_data:
            amen = models.Amenity(id=a_id, name=a_name, icon=a_icon)
            db.add(amen)
            amenities_dict[a_name] = amen
        db.commit()

        # 3. Seed 18 realistic listings
        raw_listings = [
            {
                "id": "lst_001",
                "host_id": "usr_host_1",
                "title": "Luxury Cliffside Oceanfront Villa",
                "description": "Perched on dramatic cliffs overlooking crystal clear ocean waters. Features an infinity pool, private sunset terrace, panoramic glass walls, and full luxury concierge service.",
                "property_type": "Beachfront",
                "location": "North Goa",
                "country": "India",
                "city": "Goa",
                "latitude": 15.5937,
                "longitude": 73.7370,
                "price_per_night": 12500.0,
                "cleaning_fee": 1500.0,
                "service_fee": 1100.0,
                "max_guests": 6,
                "bedrooms": 3,
                "beds": 4,
                "bathrooms": 3.5,
                "rating": 4.95,
                "review_count": 28,
                "images": [
                    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Air conditioning", "Pool", "Free parking", "Kitchen", "Hot tub", "Beach access", "TV"]
            },
            {
                "id": "lst_002",
                "host_id": "usr_host_2",
                "title": "Cozy Pine Alpine Chalet with Jacuzzi",
                "description": "Escape to the snow-covered peaks in this handcrafted cedar chalet. Cozy up by the indoor stone fireplace, soak in the outdoor Jacuzzi, and enjoy direct mountain ski trail access.",
                "property_type": "Cabins",
                "location": "Old Manali",
                "country": "India",
                "city": "Manali",
                "latitude": 32.2432,
                "longitude": 77.1892,
                "price_per_night": 7800.0,
                "cleaning_fee": 1000.0,
                "service_fee": 700.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2.0,
                "rating": 4.88,
                "review_count": 42,
                "images": [
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Fireplace", "Hot tub", "Mountain view", "Dedicated workspace", "Free parking", "Kitchen"]
            },
            {
                "id": "lst_003",
                "host_id": "usr_host_1",
                "title": "Modern Skyscraper Penthouse in Bandra",
                "description": "Stunning ultra-modern penthouse featuring floor-to-ceiling glass, Italian marble interiors, automated smart home lighting, private balcony, and skyline views of the Arabian Sea.",
                "property_type": "Amazing views",
                "location": "Bandra West, Mumbai",
                "country": "India",
                "city": "Mumbai",
                "latitude": 19.0596,
                "longitude": 72.8295,
                "price_per_night": 16000.0,
                "cleaning_fee": 2000.0,
                "service_fee": 1400.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2.5,
                "rating": 4.92,
                "review_count": 19,
                "images": [
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Air conditioning", "Dedicated workspace", "EV charger", "TV", "Washer", "Kitchen"]
            },
            {
                "id": "lst_004",
                "host_id": "usr_host_3",
                "title": "Heritage Rajasthani Royal Haveli & Courtyard",
                "description": "Step into history at this 18th-century restored Haveli. Featuring traditional hand-painted fresco murals, jharokha balconies, manicured peacock courtyard, and private swimming pool.",
                "property_type": "Mansions",
                "location": "Pink City",
                "country": "India",
                "city": "Jaipur",
                "latitude": 26.9124,
                "longitude": 75.7873,
                "price_per_night": 14500.0,
                "cleaning_fee": 1800.0,
                "service_fee": 1200.0,
                "max_guests": 8,
                "bedrooms": 4,
                "beds": 5,
                "bathrooms": 4.0,
                "rating": 4.97,
                "review_count": 35,
                "images": [
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Air conditioning", "Pool", "Free parking", "Patio or balcony", "BBQ grill", "Kitchen"]
            },
            {
                "id": "lst_005",
                "host_id": "usr_host_2",
                "title": "Jungle Infinity Sanctuary in Ubud",
                "description": "Secluded tropical sanctuary suspended over lush bamboo rainforest canopy. Private infinity pool overlooking river ravine, open-air living lounge, and organic floating breakfast.",
                "property_type": "Amazing pools",
                "location": "Ubud, Bali",
                "country": "Indonesia",
                "city": "Bali",
                "latitude": -8.5069,
                "longitude": 115.2625,
                "price_per_night": 18500.0,
                "cleaning_fee": 2000.0,
                "service_fee": 1500.0,
                "max_guests": 2,
                "bedrooms": 1,
                "beds": 1,
                "bathrooms": 1.5,
                "rating": 4.99,
                "review_count": 64,
                "images": [
                    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Pool", "Hot tub", "Patio or balcony", "Air conditioning", "Kitchen"]
            },
            {
                "id": "lst_006",
                "host_id": "usr_host_3",
                "title": "Santorini Caldera Whitewashed Cave Suite",
                "description": "Iconic Aegean Sea cave residence carved directly into volcanic rock cliffs of Oia. Sunbathe on private plunge pool terrace facing world-famous Aegean sunsets.",
                "property_type": "Luxury",
                "location": "Oia, Santorini",
                "country": "Greece",
                "city": "Santorini",
                "latitude": 36.4618,
                "longitude": 25.3753,
                "price_per_night": 24000.0,
                "cleaning_fee": 2500.0,
                "service_fee": 2000.0,
                "max_guests": 3,
                "bedrooms": 1,
                "beds": 2,
                "bathrooms": 1.0,
                "rating": 4.96,
                "review_count": 51,
                "images": [
                    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Air conditioning", "Pool", "Hot tub", "Patio or balcony", "Dedicated workspace"]
            },
            {
                "id": "lst_007",
                "host_id": "usr_host_1",
                "title": "Lakeside Wooden Lodge with Private Dock",
                "description": "Spacious timber frame lodge situated right on crystal clear waters of Lake Tahoe. Private dock, kayak launchers, fire pit, vaulted ceilings, and panoramic forest views.",
                "property_type": "Countryside",
                "location": "Lake Tahoe, California",
                "country": "USA",
                "city": "Lake Tahoe",
                "latitude": 39.0968,
                "longitude": -120.0324,
                "price_per_night": 13800.0,
                "cleaning_fee": 1600.0,
                "service_fee": 1100.0,
                "max_guests": 8,
                "bedrooms": 4,
                "beds": 5,
                "bathrooms": 3.0,
                "rating": 4.91,
                "review_count": 33,
                "images": [
                    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Fireplace", "Free parking", "BBQ grill", "Kitchen", "Washer", "TV"]
            },
            {
                "id": "lst_008",
                "host_id": "usr_host_2",
                "title": "Minimalist Glass Architectural Villa",
                "description": "Award-winning brutalist and glass architectural marvel nestled in olive groves. Features geometric infinity pool, designer Scandinavian furnishings, and indoor garden atrium.",
                "property_type": "Design",
                "location": "Amalfi Coast",
                "country": "Italy",
                "city": "Amalfi",
                "latitude": 40.6340,
                "longitude": 14.6027,
                "price_per_night": 22000.0,
                "cleaning_fee": 2200.0,
                "service_fee": 1800.0,
                "max_guests": 6,
                "bedrooms": 3,
                "beds": 3,
                "bathrooms": 3.0,
                "rating": 4.94,
                "review_count": 22,
                "images": [
                    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Air conditioning", "Pool", "Dedicated workspace", "Free parking", "EV charger", "Kitchen"]
            },
            {
                "id": "lst_009",
                "host_id": "usr_host_3",
                "title": "Traditional Japanese Machiya & Zen Garden",
                "description": "Authentic restored 100-year-old wooden Machiya townhouse in historic Gion district. Features cypress bath, tatami mat rooms, sliding shoji screens, and private Zen moss garden.",
                "property_type": "Trending",
                "location": "Gion, Kyoto",
                "country": "Japan",
                "city": "Kyoto",
                "latitude": 35.0037,
                "longitude": 135.7772,
                "price_per_night": 11500.0,
                "cleaning_fee": 1200.0,
                "service_fee": 900.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 4,
                "bathrooms": 1.5,
                "rating": 4.98,
                "review_count": 76,
                "images": [
                    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Air conditioning", "Hot tub", "Patio or balcony", "Kitchen", "Washer"]
            },
            {
                "id": "lst_010",
                "host_id": "usr_host_1",
                "title": "Tropical Oceanfront Bungalow with Reef Access",
                "description": "Steps away from white coral sands and vibrant turquoise waters. Snorkel with sea turtles straight from your lawn deck, surrounded by swaying coconut palms.",
                "property_type": "Beachfront",
                "location": "Lahaina, Maui",
                "country": "USA",
                "city": "Maui",
                "latitude": 20.8783,
                "longitude": -156.6825,
                "price_per_night": 19500.0,
                "cleaning_fee": 2100.0,
                "service_fee": 1600.0,
                "max_guests": 5,
                "bedrooms": 2,
                "beds": 3,
                "bathrooms": 2.0,
                "rating": 4.93,
                "review_count": 39,
                "images": [
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Air conditioning", "Beach access", "Patio or balcony", "Free parking", "BBQ grill", "Kitchen"]
            },
            {
                "id": "lst_011",
                "host_id": "usr_host_2",
                "title": "Swiss Alps Panoramic Glass Cube Chalet",
                "description": "Futuristic glass architecture nestled in snowcapped Swiss peaks. Heated floors, private sauna, outdoor hot tub facing Matterhorn views, and ski-in/ski-out convenience.",
                "property_type": "Mountains",
                "location": "Zermatt",
                "country": "Switzerland",
                "city": "Zermatt",
                "latitude": 45.9765,
                "longitude": 7.7491,
                "price_per_night": 28000.0,
                "cleaning_fee": 3000.0,
                "service_fee": 2400.0,
                "max_guests": 6,
                "bedrooms": 3,
                "beds": 4,
                "bathrooms": 3.0,
                "rating": 4.99,
                "review_count": 47,
                "images": [
                    "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Fireplace", "Hot tub", "Mountain view", "Sauna", "Kitchen", "Dedicated workspace"]
            },
            {
                "id": "lst_012",
                "host_id": "usr_host_3",
                "title": "Haussmannian Parisian Loft near Eiffel Tower",
                "description": "Elegant Parisian apartment featuring high ornate ceilings, herringbone parquet, floor-to-ceiling balcony windows, and direct sunset views of the Eiffel Tower.",
                "property_type": "Luxury",
                "location": "7th Arrondissement, Paris",
                "country": "France",
                "city": "Paris",
                "latitude": 48.8566,
                "longitude": 2.3522,
                "price_per_night": 17500.0,
                "cleaning_fee": 1900.0,
                "service_fee": 1400.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2.0,
                "rating": 4.90,
                "review_count": 58,
                "images": [
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Air conditioning", "Dedicated workspace", "TV", "Washer", "Kitchen"]
            },
            {
                "id": "lst_013",
                "host_id": "usr_host_1",
                "title": "Cape Town Atlantic Seaboard Beach Villa",
                "description": "Contemporary multi-level residence on Clifton Beach with unobstructed ocean vistas, glass rim pool, wine cellar, and outdoor sun deck with fire pit.",
                "property_type": "Beachfront",
                "location": "Clifton, Cape Town",
                "country": "South Africa",
                "city": "Cape Town",
                "latitude": -33.9249,
                "longitude": 18.4241,
                "price_per_night": 16500.0,
                "cleaning_fee": 1800.0,
                "service_fee": 1300.0,
                "max_guests": 6,
                "bedrooms": 3,
                "beds": 3,
                "bathrooms": 3.0,
                "rating": 4.92,
                "review_count": 31,
                "images": [
                    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Pool", "Beach access", "Free parking", "BBQ grill", "Fireplace", "Kitchen"]
            },
            {
                "id": "lst_014",
                "host_id": "usr_host_2",
                "title": "Queenstown Alpine Lake Estate",
                "description": "Magnificent estate overlooking Lake Wakatipu and Remarkables mountain range. Features outdoor heated spa, cedar sauna, stone fireplace, and floor-to-ceiling glass.",
                "property_type": "Mountains",
                "location": "Queenstown",
                "country": "New Zealand",
                "city": "Queenstown",
                "latitude": -45.0312,
                "longitude": 168.6626,
                "price_per_night": 21000.0,
                "cleaning_fee": 2200.0,
                "service_fee": 1700.0,
                "max_guests": 8,
                "bedrooms": 4,
                "beds": 5,
                "bathrooms": 4.0,
                "rating": 4.97,
                "review_count": 45,
                "images": [
                    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Fireplace", "Hot tub", "Mountain view", "Free parking", "Kitchen", "Washer"]
            },
            {
                "id": "lst_015",
                "host_id": "usr_host_3",
                "title": "Tulum Jungle Treehouse with Cenote Dip Pool",
                "description": "Eco-luxury bamboo treehouse surrounded by Mayan jungle foliage. Features private cenote-style plunge pool, rooftop stargazing bed, and solar-powered amenities.",
                "property_type": "Cabins",
                "location": "Tulum, Quintana Roo",
                "country": "Mexico",
                "city": "Tulum",
                "latitude": 20.2114,
                "longitude": -87.4654,
                "price_per_night": 14000.0,
                "cleaning_fee": 1500.0,
                "service_fee": 1100.0,
                "max_guests": 2,
                "bedrooms": 1,
                "beds": 1,
                "bathrooms": 1.0,
                "rating": 4.89,
                "review_count": 27,
                "images": [
                    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Pool", "Patio or balcony", "Free parking", "Kitchen", "BBQ grill"]
            },
            {
                "id": "lst_016",
                "host_id": "usr_host_1",
                "title": "Downtown Dubai Burj Peak Luxury Residence",
                "description": "Opulent high-rise luxury flat with direct front-row view of Burj Khalifa and Dubai Fountains. Access to infinity pool, gym, and private chauffeur.",
                "property_type": "Luxury",
                "location": "Downtown Dubai",
                "country": "UAE",
                "city": "Dubai",
                "latitude": 25.1972,
                "longitude": 55.2744,
                "price_per_night": 26000.0,
                "cleaning_fee": 2800.0,
                "service_fee": 2100.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2.5,
                "rating": 4.95,
                "review_count": 53,
                "images": [
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Air conditioning", "Pool", "EV charger", "Dedicated workspace", "TV", "Washer", "Kitchen"]
            },
            {
                "id": "lst_017",
                "host_id": "usr_host_1",
                "title": "Grand Heritage Palace Hotel & Spa",
                "description": "Luxurious royal palace hotel overlooking Lake Pichola. Features butler service, infinity pool, ayurvedic spa, and fine dining.",
                "property_type": "Hotel",
                "location": "Lake Pichola, Udaipur",
                "country": "India",
                "city": "Udaipur",
                "latitude": 24.5854,
                "longitude": 73.6825,
                "price_per_night": 18000.0,
                "cleaning_fee": 1500.0,
                "service_fee": 1200.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2.0,
                "rating": 4.96,
                "review_count": 48,
                "images": [
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Air conditioning", "Pool", "Free parking", "Kitchen", "Hot tub"]
            },
            {
                "id": "lst_018",
                "host_id": "usr_host_2",
                "title": "Grand Central Sky View Apartment",
                "description": "Sophisticated high-floor city center apartment with sea view balconies, marble kitchen, and 24/7 concierge.",
                "property_type": "Apartment",
                "location": "Marine Drive, Mumbai",
                "country": "India",
                "city": "Mumbai",
                "latitude": 18.9440,
                "longitude": 72.8238,
                "price_per_night": 14000.0,
                "cleaning_fee": 1200.0,
                "service_fee": 1000.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2.0,
                "rating": 4.91,
                "review_count": 31,
                "images": [
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Air conditioning", "Dedicated workspace", "TV", "Washer", "Kitchen"]
            },
            {
                "id": "lst_019",
                "host_id": "usr_host_1",
                "title": "Boutique Beachfront Hotel & Suites",
                "description": "Chic Mediterranean-style boutique hotel on Candolim beach with poolside lounge bar and complimentary breakfast.",
                "property_type": "Hotel",
                "location": "Candolim Beach",
                "country": "India",
                "city": "Goa",
                "latitude": 15.5177,
                "longitude": 73.7627,
                "price_per_night": 9500.0,
                "cleaning_fee": 800.0,
                "service_fee": 600.0,
                "max_guests": 3,
                "bedrooms": 1,
                "beds": 2,
                "bathrooms": 1.0,
                "rating": 4.88,
                "review_count": 52,
                "images": [
                    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Air conditioning", "Pool", "Beach access", "Free parking"]
            },
            {
                "id": "lst_020",
                "host_id": "usr_host_3",
                "title": "Lonavala Glasshouse Villa with Heated Pool",
                "description": "Private weekend villa surrounded by misty Western Ghats hills. Heated swimming pool, lawn deck, and BBQ pit.",
                "property_type": "Villa",
                "location": "Khandala, Lonavala",
                "country": "India",
                "city": "Lonavala",
                "latitude": 18.7557,
                "longitude": 73.4091,
                "price_per_night": 16500.0,
                "cleaning_fee": 1500.0,
                "service_fee": 1100.0,
                "max_guests": 8,
                "bedrooms": 4,
                "beds": 5,
                "bathrooms": 4.0,
                "rating": 4.95,
                "review_count": 40,
                "images": [
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Pool", "Hot tub", "BBQ grill", "Free parking", "Kitchen"]
            },
            {
                "id": "lst_021",
                "host_id": "usr_host_2",
                "title": "Serene Tea Garden Heritage Bungalow",
                "description": "1920s colonial tea estate home nestled in rolling green hills of Munnar. Fresh mountain air, fireplace, and organic tea tastings.",
                "property_type": "Countryside",
                "location": "Munnar",
                "country": "India",
                "city": "Munnar",
                "latitude": 10.0889,
                "longitude": 77.0595,
                "price_per_night": 8200.0,
                "cleaning_fee": 900.0,
                "service_fee": 600.0,
                "max_guests": 6,
                "bedrooms": 3,
                "beds": 3,
                "bathrooms": 2.5,
                "rating": 4.93,
                "review_count": 29,
                "images": [
                    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Fireplace", "Free parking", "Mountain view", "Kitchen"]
            },
            {
                "id": "lst_022",
                "host_id": "usr_host_1",
                "title": "Maldives Overwater Resort Villa & Butler",
                "description": "Exclusive overwater bungalow with glass floor viewing ocean life, private plunge pool, and direct lagoon stair access.",
                "property_type": "Luxury",
                "location": "North Male Atoll",
                "country": "Maldives",
                "city": "Male",
                "latitude": 4.1755,
                "longitude": 73.5093,
                "price_per_night": 35000.0,
                "cleaning_fee": 3000.0,
                "service_fee": 2500.0,
                "max_guests": 2,
                "bedrooms": 1,
                "beds": 1,
                "bathrooms": 1.5,
                "rating": 4.99,
                "review_count": 68,
                "images": [
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Air conditioning", "Pool", "Beach access", "Hot tub"]
            },
            {
                "id": "lst_023",
                "host_id": "usr_host_3",
                "title": "Himalayan Cedar Wood Mountain Lodge",
                "description": "Handcrafted log cabin surrounded by pine forests and snow peaks. Cozy wood stove, hammock deck, and star gazing roof.",
                "property_type": "Cabins",
                "location": "Parvati Valley",
                "country": "India",
                "city": "Kasol",
                "latitude": 32.0100,
                "longitude": 77.3150,
                "price_per_night": 6500.0,
                "cleaning_fee": 700.0,
                "service_fee": 500.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 1.0,
                "rating": 4.87,
                "review_count": 36,
                "images": [
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Fireplace", "Mountain view", "Free parking", "Kitchen"]
            },
            {
                "id": "lst_024",
                "host_id": "usr_host_2",
                "title": "5-Star Luxury Boutique Hotel & Rooftop Bar",
                "description": "Premier luxury hotel in Bandra featuring rooftop infinity pool, cocktail lounge, gym, and award-winning dining.",
                "property_type": "Hotel",
                "location": "Bandra West, Mumbai",
                "country": "India",
                "city": "Mumbai",
                "latitude": 19.0596,
                "longitude": 72.8295,
                "price_per_night": 21000.0,
                "cleaning_fee": 2000.0,
                "service_fee": 1600.0,
                "max_guests": 2,
                "bedrooms": 1,
                "beds": 1,
                "bathrooms": 1.0,
                "rating": 4.94,
                "review_count": 55,
                "images": [
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&auto=format&fit=crop&q=80"
                ],
                "amenities": ["Wifi", "Air conditioning", "Pool", "EV charger", "TV", "Dedicated workspace"]
            }
        ]

        for item in raw_listings:
            imgs = item.pop("images")
            amens = item.pop("amenities")
            listing = models.Listing(**item, created_at=datetime.utcnow())

            # Add images
            for pos, img_url in enumerate(imgs):
                listing.images.append(
                    models.ListingImage(id=f"img_{listing.id}_{pos}", image_url=img_url, position=pos)
                )

            # Add amenities
            for a_name in amens:
                if a_name in amenities_dict:
                    listing.amenities.append(amenities_dict[a_name])

            db.add(listing)

        db.commit()
        print("Listings successfully created.")

        # 4. Seed Reviews
        reviews_data = [
            ("lst_001", "usr_guest_1", 5.0, "Absolute paradise! The cliffside infinity pool and sunset views exceeded all our expectations. Ria is a top-notch superhost!"),
            ("lst_001", "usr_guest_2", 4.9, "Clean, stylish, and incredibly peaceful. Waking up to the ocean sound every morning was magical."),
            ("lst_002", "usr_guest_1", 4.8, "The fireplace and hot tub after skiing in Manali made our trip unforgettable. Highly recommended chalet!"),
            ("lst_003", "usr_guest_2", 5.0, "Spectacular Mumbai skyline views! Super high-tech smart home features and immaculate condition."),
            ("lst_004", "usr_guest_1", 5.0, "Living like royalty in Jaipur! The peacock courtyard and fresco murals are breathtaking."),
            ("lst_005", "usr_guest_2", 5.0, "Ubud jungle pool view is unreal. The floating breakfast was delicious!"),
        ]

        for r_lst, r_usr, r_rate, r_comment in reviews_data:
            r_id = f"rev_{r_lst}_{r_usr}"
            db.add(
                models.Review(
                    id=r_id,
                    listing_id=r_lst,
                    user_id=r_usr,
                    rating=r_rate,
                    comment=r_comment,
                    created_at=datetime.utcnow() - timedelta(days=random.randint(5, 40))
                )
            )

        db.commit()
        print("Reviews seeded.")

        # 5. Seed Existing Bookings (to block dates on initial state)
        today = datetime.utcnow().date()
        bookings_data = [
            ("lst_001", "usr_guest_1", str(today + timedelta(days=2)), str(today + timedelta(days=6)), 2, 4, 50000.0, 1500.0, 1100.0, 52600.0),
            ("lst_002", "usr_guest_2", str(today + timedelta(days=10)), str(today + timedelta(days=14)), 3, 4, 31200.0, 1000.0, 700.0, 32900.0),
            ("lst_005", "usr_guest_1", str(today + timedelta(days=5)), str(today + timedelta(days=9)), 2, 4, 74000.0, 2000.0, 1500.0, 77500.0),
        ]

        for b_lst, b_usr, cin, cout, g_cnt, n_cnt, sub, cln, srv, tot in bookings_data:
            b_id = f"bk_{b_lst}_{b_usr}"
            db.add(
                models.Booking(
                    id=b_id,
                    listing_id=b_lst,
                    guest_id=b_usr,
                    check_in=cin,
                    check_out=cout,
                    guests=g_cnt,
                    nights=n_cnt,
                    subtotal=sub,
                    cleaning_fee=cln,
                    service_fee=srv,
                    total_price=tot,
                    status="confirmed",
                    created_at=datetime.utcnow() - timedelta(days=10)
                )
            )

        # 6. Seed Favorites
        db.add(models.Favorite(id="fav_01", user_id="usr_guest_1", listing_id="lst_001"))
        db.add(models.Favorite(id="fav_02", user_id="usr_guest_1", listing_id="lst_005"))
        db.add(models.Favorite(id="fav_03", user_id="usr_guest_2", listing_id="lst_002"))

        db.commit()
        print("Seed data completed successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
