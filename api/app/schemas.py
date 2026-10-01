from typing import List, Optional, Literal, Dict
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class RestaurantOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    tagline: str
    phone: str
    address: str
    timing: str
    free_delivery: bool
    delivery_note: str
    platforms: str
    party_catering_text: str
    banner_text: str

class RestaurantUpdate(BaseModel):
    phone: Optional[str] = None
    timing: Optional[str] = None
    address: Optional[str] = None
    banner_text: Optional[str] = None
    party_catering_text: Optional[str] = None

class MenuItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category_id: int
    name: str
    description: str
    half_price: Optional[float] = None
    full_price: float
    is_veg: bool
    is_spicy: bool
    is_bestseller: bool
    is_available: bool
    image_url: str

class MenuItemCreate(BaseModel):
    category_id: int
    name: str = Field(min_length=1, max_length=150)
    description: Optional[str] = ""
    half_price: Optional[float] = Field(default=None, ge=0)
    full_price: float = Field(gt=0)
    is_veg: bool = True
    is_spicy: bool = False
    is_bestseller: bool = False
    is_available: bool = True
    image_url: Optional[str] = ""

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    half_price: Optional[float] = None
    full_price: Optional[float] = Field(default=None, gt=0)
    is_veg: Optional[bool] = None
    is_spicy: Optional[bool] = None
    is_bestseller: Optional[bool] = None
    is_available: Optional[bool] = None
    image_url: Optional[str] = None

class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    display_order: int
    icon: str
    description: str
    items: List[MenuItemOut] = []

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    google_id: str
    email: str
    name: str
    picture: str
    role: str
    created_at: datetime

class GoogleAuthRequest(BaseModel):
    credential: Optional[str] = None  # Google JWT credential from GIS
    email: Optional[str] = None
    name: Optional[str] = None
    picture: Optional[str] = None
    google_id: Optional[str] = None

class AuthResponse(BaseModel):
    token: str
    user: UserOut

class OrderItemCreate(BaseModel):
    menu_item_id: int
    portion: Literal["Half", "Full", "half", "full"]
    quantity: int = Field(ge=1)

class OrderCreate(BaseModel):
    user_id: Optional[int] = None
    customer_name: str = Field(min_length=1)
    customer_phone: str = Field(min_length=5)
    delivery_address: str = Field(min_length=1)
    delivery_notes: Optional[str] = ""
    order_type: str = "Delivery"  # "Delivery" or "Takeaway"
    payment_method: str = "Cash on Delivery"
    items: List[OrderItemCreate]

class OrderStatusUpdate(BaseModel):
    status: Literal["Confirmed", "Preparing in Wok", "Out for Delivery", "Delivered", "Cancelled"]

class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    menu_item_id: int
    item_name: str
    portion: str
    unit_price: float
    quantity: int
    total_price: float

class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: Optional[int] = None
    order_number: str
    customer_name: str
    customer_phone: str
    delivery_address: str
    delivery_notes: str
    order_type: str
    payment_method: str
    subtotal: float
    delivery_fee: float
    total_amount: float
    status: str
    created_at: datetime
    items: List[OrderItemOut] = []

class PartyInquiryCreate(BaseModel):
    customer_name: str = Field(min_length=1)
    customer_phone: str = Field(min_length=5)
    event_date: str = Field(min_length=1)
    approx_guests: int = Field(gt=0)
    party_type: str = "Veg Catering"
    notes: Optional[str] = ""

class PartyInquiryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_name: str
    customer_phone: str
    event_date: str
    approx_guests: int
    party_type: str
    notes: str
    created_at: datetime

class DashboardCategoryBreakdown(BaseModel):
    id: int
    name: str
    slug: str
    items_count: int

class DashboardTopItem(BaseModel):
    name: str
    quantity_sold: int
    sales_amount: float

class DashboardStatsOut(BaseModel):
    total_revenue: float
    total_orders: int
    active_orders: int
    delivered_orders: int
    average_order_value: float
    total_dishes: int
    total_party_inquiries: int
    category_breakdown: List[DashboardCategoryBreakdown]
    top_items: List[DashboardTopItem]
    status_counts: Dict[str, int]
