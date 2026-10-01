from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Restaurant
from ..schemas import RestaurantOut

router = APIRouter(tags=["Restaurant"])

@router.get("", response_model=RestaurantOut)
@router.get("/", response_model=RestaurantOut)
def get_restaurant_info(db: Session = Depends(get_db)):
    restaurant = db.query(Restaurant).first()
    if not restaurant:
        # Fallback to create and return default restaurant metadata
        restaurant = Restaurant(
            name="YUMMY EXPRESS",
            tagline="॥ श्री स्वामी समर्थ ॥",
            phone="7249041603",
            address="In front of BMC Office, Near Liberty Garden (Khaugalli), Malad West",
            timing="7:30 PM to 11:30 PM",
            free_delivery=True,
            delivery_note="Free Delivery",
            platforms="Zomato & Swiggy",
            party_catering_text="We also take orders for any kind of party & We take orders for non-veg parties only at your place",
            banner_text="Authentic Indo-Chinese Delicacies • Piping Hot Wok Specials • Fast & Free Delivery"
        )
        db.add(restaurant)
        db.commit()
        db.refresh(restaurant)
    return restaurant
