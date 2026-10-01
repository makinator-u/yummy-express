import uuid
import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from ..database import get_db
from ..models import Order, OrderItem, MenuItem
from ..schemas import OrderCreate, OrderOut

router = APIRouter(prefix="/api/orders", tags=["Orders"])

def generate_order_number(db: Session) -> str:
    # Try up to 5 times to generate an absolutely collision-free order number
    for _ in range(5):
        time_part = datetime.datetime.now().strftime("%d%H%M")
        hex_part = uuid.uuid4().hex[:4].upper()
        order_num = f"YE-{time_part}{hex_part}"
        if not db.query(Order).filter(Order.order_number == order_num).first():
            return order_num
    # Fallback to full timestamp + random token
    return f"YE-{int(datetime.datetime.now().timestamp())}-{uuid.uuid4().hex[:6].upper()}"

@router.post("", response_model=OrderOut)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    if not order_data.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")

    subtotal = 0.0
    order_items_to_create = []

    for item_req in order_data.items:
        menu_item = db.query(MenuItem).filter(MenuItem.id == item_req.menu_item_id).first()
        if not menu_item:
            raise HTTPException(status_code=404, detail=f"Menu item id {item_req.menu_item_id} not found")

        if not menu_item.is_available:
            raise HTTPException(status_code=400, detail=f"'{menu_item.name}' is currently unavailable")

        portion = item_req.portion.strip().capitalize()
        if portion == "Half":
            if menu_item.half_price is None:
                raise HTTPException(status_code=400, detail=f"{menu_item.name} is only available in Full portion")
            unit_price = menu_item.half_price
        elif portion == "Full":
            unit_price = menu_item.full_price
        else:
            raise HTTPException(status_code=400, detail=f"Invalid portion '{item_req.portion}'. Must be 'Half' or 'Full'")

        line_total = unit_price * item_req.quantity
        subtotal += line_total

        order_items_to_create.append({
            "menu_item_id": menu_item.id,
            "item_name": menu_item.name,
            "portion": portion,
            "unit_price": unit_price,
            "quantity": item_req.quantity,
            "total_price": line_total
        })

    # Free delivery
    delivery_fee = 0.0
    total_amount = subtotal + delivery_fee

    try:
        new_order = Order(
            order_number=generate_order_number(db),
            customer_name=order_data.customer_name.strip(),
            customer_phone=order_data.customer_phone.strip(),
            delivery_address=order_data.delivery_address.strip(),
            delivery_notes=(order_data.delivery_notes or "").strip(),
            order_type=order_data.order_type or "Delivery",
            payment_method=order_data.payment_method or "Cash on Delivery",
            subtotal=round(subtotal, 2),
            delivery_fee=round(delivery_fee, 2),
            total_amount=round(total_amount, 2),
            status="Confirmed"
        )

        db.add(new_order)
        db.flush()

        for item_dict in order_items_to_create:
            order_item = OrderItem(
                order_id=new_order.id,
                menu_item_id=item_dict["menu_item_id"],
                item_name=item_dict["item_name"],
                portion=item_dict["portion"],
                unit_price=item_dict["unit_price"],
                quantity=item_dict["quantity"],
                total_price=item_dict["total_price"]
            )
            db.add(order_item)

        db.commit()
        db.refresh(new_order)
        return new_order
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Could not create order due to a conflict. Please retry.")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to place order: {str(e)}")

@router.get("/{order_number}", response_model=OrderOut)
def get_order_by_number(order_number: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_number == order_number.strip().upper()).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.get("", response_model=List[OrderOut])
def get_recent_orders(
    limit: int = Query(default=15, ge=1, le=100), 
    db: Session = Depends(get_db)
):
    orders = db.query(Order).order_by(Order.created_at.desc()).limit(limit).all()
    return orders
