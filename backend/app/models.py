import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import relationship
from .database import Base

def utc_now():
    return datetime.datetime.now(datetime.timezone.utc)

class Restaurant(Base):
    __tablename__ = "restaurant"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="YUMMY EXPRESS")
    tagline = Column(String(100), default="॥ श्री स्वामी समर्थ ॥")
    phone = Column(String(50), default="7249041603")
    address = Column(String(255), default="In front of BMC Office, Near Liberty Garden (Khaugalli), Malad West")
    timing = Column(String(100), default="7:30 PM to 11:30 PM")
    free_delivery = Column(Boolean, default=True)
    delivery_note = Column(String(255), default="Free Delivery")
    platforms = Column(String(100), default="Zomato & Swiggy")
    party_catering_text = Column(String(255), default="We also take orders for any kind of party & We take orders for non-veg parties only at your place")
    banner_text = Column(String(255), default="Fresh, steaming Indo-Chinese wok specialties cooked live!")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, index=True)
    display_order = Column(Integer, default=0)
    icon = Column(String(50), default="soup")
    description = Column(String(255), default="")

    items = relationship("MenuItem", back_populates="category", cascade="all, delete-orphan")

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False, index=True)
    name = Column(String(150), nullable=False, index=True)
    description = Column(Text, default="")
    half_price = Column(Float, nullable=True)  # None if half portion not offered
    full_price = Column(Float, nullable=False)
    is_veg = Column(Boolean, default=True)
    is_spicy = Column(Boolean, default=False)
    is_bestseller = Column(Boolean, default=False)
    is_available = Column(Boolean, default=True)
    image_url = Column(String(255), default="")

    category = relationship("Category", back_populates="items")
    order_items = relationship("OrderItem", back_populates="menu_item")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    google_id = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    picture = Column(String(500), default="")
    role = Column(String(50), default="customer")  # customer, admin
    created_at = Column(DateTime(timezone=True), default=utc_now, server_default=func.now())

    orders = relationship("Order", back_populates="user")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    customer_name = Column(String(100), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    delivery_address = Column(Text, nullable=False)
    delivery_notes = Column(Text, default="")
    order_type = Column(String(50), default="Delivery")  # Delivery, Takeaway
    payment_method = Column(String(50), default="Cash on Delivery") # Cash, UPI on Delivery
    subtotal = Column(Float, default=0.0)
    delivery_fee = Column(Float, default=0.0)
    total_amount = Column(Float, default=0.0)
    status = Column(String(50), default="Confirmed", index=True)  # Confirmed, Preparing in Wok, Out for Delivery, Delivered, Cancelled
    created_at = Column(DateTime(timezone=True), default=utc_now, server_default=func.now())

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, index=True)
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"), nullable=False, index=True)
    item_name = Column(String(150), nullable=False)
    portion = Column(String(20), nullable=False)  # "Half" or "Full"
    unit_price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    total_price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    menu_item = relationship("MenuItem", back_populates="order_items")

class PartyInquiry(Base):
    __tablename__ = "party_inquiries"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    event_date = Column(String(50), nullable=False)
    approx_guests = Column(Integer, nullable=False)
    party_type = Column(String(100), default="Veg Catering")
    notes = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), default=utc_now, server_default=func.now())
