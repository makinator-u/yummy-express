from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any, List
from ..database import get_db
from ..models import Order, OrderItem, MenuItem, Category, PartyInquiry, Restaurant
from ..schemas import (
    MenuItemOut, 
    MenuItemCreate, 
    MenuItemUpdate, 
    OrderStatusUpdate, 
    RestaurantOut, 
    RestaurantUpdate,
    DashboardStatsOut
)

router = APIRouter(tags=["Dashboard"])

@router.get("/stats", response_model=DashboardStatsOut)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_orders = db.query(Order).count()
    valid_orders_count = db.query(Order).filter(Order.status != "Cancelled").count()
    total_revenue = db.query(func.sum(Order.total_amount)).filter(Order.status != "Cancelled").scalar() or 0.0
    
    # Active orders (Confirmed, Preparing in Wok, Out for Delivery)
    active_orders = db.query(Order).filter(Order.status.in_(["Confirmed", "Preparing in Wok", "Out for Delivery"])).count()
    
    # Completed orders
    delivered_orders = db.query(Order).filter(Order.status == "Delivered").count()
    
    # Average Order Value (AOV based on valid non-cancelled orders)
    aov = (total_revenue / valid_orders_count) if valid_orders_count > 0 else 0.0

    # Total menu items and party inquiries
    total_dishes = db.query(MenuItem).count()
    total_parties = db.query(PartyInquiry).count()

    # Category item distribution in a SINGLE aggregated query
    category_counts = (
        db.query(
            Category.id,
            Category.name,
            Category.slug,
            func.count(MenuItem.id).label("items_count")
        )
        .outerjoin(MenuItem, MenuItem.category_id == Category.id)
        .group_by(Category.id, Category.name, Category.slug)
        .order_by(Category.display_order.asc())
        .all()
    )
    category_breakdown = [
        {
            "id": cat[0],
            "name": cat[1],
            "slug": cat[2],
            "items_count": cat[3]
        }
        for cat in category_counts
    ]

    # Top selling items from OrderItem records
    top_items_query = (
        db.query(
            OrderItem.item_name,
            func.sum(OrderItem.quantity).label("total_sold"),
            func.sum(OrderItem.total_price).label("total_sales")
        )
        .join(Order, Order.id == OrderItem.order_id)
        .filter(Order.status != "Cancelled")
        .group_by(OrderItem.item_name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(6)
        .all()
    )

    top_items = [
        {
            "name": item[0],
            "quantity_sold": int(item[1] or 0),
            "sales_amount": round(float(item[2] or 0.0), 2)
        }
        for item in top_items_query
    ]

    # Status counts breakdown in a SINGLE aggregated query
    raw_status_counts = dict(
        db.query(Order.status, func.count(Order.id))
        .group_by(Order.status)
        .all()
    )
    statuses = ["Confirmed", "Preparing in Wok", "Out for Delivery", "Delivered", "Cancelled"]
    status_counts = {st: raw_status_counts.get(st, 0) for st in statuses}

    return {
        "total_revenue": round(float(total_revenue), 2),
        "total_orders": total_orders,
        "active_orders": active_orders,
        "delivered_orders": delivered_orders,
        "average_order_value": round(float(aov), 2),
        "total_dishes": total_dishes,
        "total_party_inquiries": total_parties,
        "category_breakdown": category_breakdown,
        "top_items": top_items,
        "status_counts": status_counts
    }

@router.patch("/orders/{order_id}/status")
def update_order_status(
    order_id: int, 
    status_data: OrderStatusUpdate, 
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = status_data.status
    db.commit()
    db.refresh(order)
    return {"message": f"Order status updated to {order.status}", "order_id": order.id, "status": order.status}

@router.patch("/menu/items/{item_id}", response_model=MenuItemOut)
def update_menu_item(
    item_id: int, 
    update_data: MenuItemUpdate, 
    db: Session = Depends(get_db)
):
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if update_data.is_available is not None:
        item.is_available = update_data.is_available
    if update_data.is_bestseller is not None:
        item.is_bestseller = update_data.is_bestseller
    if update_data.is_spicy is not None:
        item.is_spicy = update_data.is_spicy
    if update_data.half_price is not None:
        item.half_price = update_data.half_price
    if update_data.full_price is not None:
        item.full_price = update_data.full_price
    if update_data.name is not None and update_data.name.strip():
        item.name = update_data.name.strip()
    if update_data.description is not None:
        item.description = update_data.description.strip()
    if update_data.image_url is not None:
        item.image_url = update_data.image_url.strip()

    db.commit()
    db.refresh(item)
    return item

@router.post("/menu/items", response_model=MenuItemOut)
def create_menu_item(item_data: MenuItemCreate, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == item_data.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail=f"Category with ID {item_data.category_id} not found")

    new_item = MenuItem(
        name=item_data.name.strip(),
        category_id=item_data.category_id,
        description=(item_data.description or "").strip(),
        half_price=item_data.half_price,
        full_price=item_data.full_price,
        is_veg=item_data.is_veg,
        is_spicy=item_data.is_spicy,
        is_bestseller=item_data.is_bestseller,
        is_available=item_data.is_available,
        image_url=(item_data.image_url or "").strip()
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/restaurant", response_model=RestaurantOut)
def update_restaurant_settings(settings: RestaurantUpdate, db: Session = Depends(get_db)):
    restaurant = db.query(Restaurant).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant record not found")

    if settings.phone is not None:
        restaurant.phone = settings.phone.strip()
    if settings.timing is not None:
        restaurant.timing = settings.timing.strip()
    if settings.address is not None:
        restaurant.address = settings.address.strip()
    if settings.banner_text is not None:
        restaurant.banner_text = settings.banner_text.strip()
    if settings.party_catering_text is not None:
        restaurant.party_catering_text = settings.party_catering_text.strip()

    db.commit()
    db.refresh(restaurant)
    return restaurant
