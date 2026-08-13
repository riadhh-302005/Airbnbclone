from app.database import SessionLocal
from app.models import User

db = SessionLocal()
h = db.query(User).filter_by(id="usr_host_1").first()
g = db.query(User).filter_by(id="usr_guest_1").first()

if h:
    h.name = "Ria"
    h.email = "ria@example.com"

if g:
    g.name = "Ranjot"
    g.email = "ranjot@example.com"

db.commit()
db.close()
print("Updated database user names to Ria and Ranjot successfully.")
