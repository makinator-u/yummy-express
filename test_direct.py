from backend.app.database import SessionLocal, Base, engine, init_db
from backend.app.seed_data import seed_database
from backend.app.routes import restaurant, menu, orders, party, dashboard, auth
from backend.app.schemas import (
    OrderCreate, 
    OrderItemCreate, 
    PartyInquiryCreate, 
    OrderStatusUpdate, 
    MenuItemUpdate, 
    RestaurantUpdate,
    GoogleAuthRequest
)

def run_direct_tests():
    print("=== TESTING FASTAPI ENDPOINTS & ORM DIRECTLY ===")
    
    # 1. Initialize DB & auto-migrations
    init_db()
    db = SessionLocal()
    seed_database(db)

    try:
        # 2. Test Restaurant info
        res = restaurant.get_restaurant_info(db)
        print("✅ Restaurant info:", res.name, "| Phone:", res.phone)
        assert res.name == "YUMMY EXPRESS"

        # 3. Test Categories
        cats = menu.get_categories_with_items(db)
        print(f"✅ Categories loaded: {len(cats)} categories")
        total_items = sum(len(c.items) for c in cats)
        print(f"✅ Total menu items in SQLite: {total_items}")
        assert len(cats) == 4
        assert total_items >= 60

        # 4. Test Google Auth Sign In
        auth_req = GoogleAuthRequest(
            email="urvadesai@gmail.com",
            name="Urva Desai",
            google_id="google_sub_109283746152",
            picture="https://lh3.googleusercontent.com/a/default-user"
        )
        auth_res = auth.sign_in_with_google(auth_req, db)
        user = auth_res["user"]
        token = auth_res["token"]
        print(f"✅ Google Auth Sign In Success: User '{user.name}' ({user.email}) | Token: {token[:16]}...")
        assert user.email == "urvadesai@gmail.com"
        assert token.startswith("ye_")

        # Verify current user token
        verified_user = auth.verify_auth_token(token, db)
        assert verified_user is not None
        assert verified_user.id == user.id

        # 5. Test Order Creation Linked to User
        order_in = OrderCreate(
            user_id=user.id,
            customer_name="Urva Desai",
            customer_phone="9820198201",
            delivery_address="Flat 301, Palm Court, Near Liberty Garden, Malad West",
            delivery_notes="Extra spicy noodles please",
            order_type="Delivery",
            payment_method="UPI QR on Delivery",
            items=[
                OrderItemCreate(menu_item_id=1, portion="Half", quantity=1),
                OrderItemCreate(menu_item_id=7, portion="Full", quantity=1),
                OrderItemCreate(menu_item_id=29, portion="Full", quantity=1)
            ]
        )
        new_order = orders.create_order(order_in, db)
        print(f"✅ Order Created: {new_order.order_number} | User ID: {new_order.user_id} | Amount: ₹{new_order.total_amount}")
        assert new_order.total_amount == 390.0
        assert new_order.user_id == user.id

        # 6. Test User Order History
        user_orders = auth.get_user_orders(user=user, limit=10, db=db)
        print(f"✅ User Orders Retrieved: {len(user_orders)} orders for {user.name}")
        assert len(user_orders) >= 1

        # 7. Test Party Inquiry
        party_in = PartyInquiryCreate(
            customer_name="Vikram Desai",
            customer_phone="9833445566",
            event_date="2026-10-15",
            approx_guests=50,
            party_type="Non-Veg Party (At Your Place Only)",
            notes="Malad West outdoor"
        )
        new_party = party.create_party_inquiry(party_in, db)
        print(f"✅ Party Inquiry: ID {new_party.id} for {new_party.customer_name}")
        assert new_party.approx_guests == 50

        # 8. Test Dashboard Stats (Single aggregated query & corrected AOV)
        stats = dashboard.get_dashboard_stats(db)
        print(f"✅ Dashboard Stats: Revenue=₹{stats['total_revenue']}, Orders={stats['total_orders']}, AOV=₹{stats['average_order_value']}")
        assert stats["total_orders"] >= 1
        assert "Confirmed" in stats["status_counts"]
        assert len(stats["category_breakdown"]) == 4

        # 9. Test Order Status Update via schema
        status_up = OrderStatusUpdate(status="Preparing in Wok")
        updated_status = dashboard.update_order_status(new_order.id, status_up, db)
        print(f"✅ Order Status Updated: {updated_status['status']}")
        assert updated_status["status"] == "Preparing in Wok"

        # 10. Test Menu Item Update via schema
        menu_up = MenuItemUpdate(is_bestseller=True, description="Updated hot test soup")
        updated_item = dashboard.update_menu_item(1, menu_up, db)
        print(f"✅ Menu Item Updated: {updated_item.name}, Bestseller={updated_item.is_bestseller}")
        assert updated_item.is_bestseller is True

        # 11. Test Restaurant Update via schema
        rest_up = RestaurantUpdate(timing="7:30 PM to 12:00 AM")
        updated_rest = dashboard.update_restaurant_settings(rest_up, db)
        print(f"✅ Restaurant Settings Updated: {updated_rest.timing}")
        assert updated_rest.timing == "7:30 PM to 12:00 AM"

        print("\n🎉 ALL 11 TESTS (INCLUDING GOOGLE AUTH & USER ORDERS) PASSED DIRECTLY WITH ZERO ERRORS!")

    finally:
        db.close()

if __name__ == "__main__":
    run_direct_tests()
