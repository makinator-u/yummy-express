import urllib.request
import json

def test_full_system():
    print("=== TESTING YUMMY EXPRESS FASTAPI & SQLITE SYSTEM ===")
    
    # 0. Health check
    req = urllib.request.urlopen("http://127.0.0.1:8000/health")
    health = json.loads(req.read().decode())
    print("✅ Health check:", health)
    assert health["status"] == "healthy"

    # 1. Test Restaurant info
    req = urllib.request.urlopen("http://127.0.0.1:8000/api/restaurant")
    res_data = json.loads(req.read().decode())
    print("✅ Restaurant info:", res_data["name"], "|", res_data["tagline"], "| Phone:", res_data["phone"])
    assert res_data["name"] == "YUMMY EXPRESS"
    assert res_data["phone"] == "7249041603"

    # 2. Test Categories
    req = urllib.request.urlopen("http://127.0.0.1:8000/api/menu/categories")
    cats = json.loads(req.read().decode())
    print(f"✅ Categories loaded: {len(cats)} categories")
    total_items = sum(len(c["items"]) for c in cats)
    print(f"✅ Total menu items in SQLite: {total_items}")
    assert len(cats) == 4
    assert total_items >= 60

    # 3. Test Order Placement
    order_data = {
        "customer_name": "Pooja Mehta",
        "customer_phone": "9820198201",
        "delivery_address": "Flat 301, Palm Court, Near Liberty Garden, Malad West",
        "delivery_notes": "Please deliver with extra Schezwan dip",
        "order_type": "Delivery",
        "payment_method": "UPI QR on Delivery",
        "items": [
            {"menu_item_id": 1, "portion": "Half", "quantity": 1},      # Manchow Soup Half: 60
            {"menu_item_id": 7, "portion": "Full", "quantity": 1},      # Chinese Bhel Full: 150
            {"menu_item_id": 29, "portion": "Full", "quantity": 1}      # Tripple Rice Full: 180
        ]
    }
    post_req = urllib.request.Request(
        "http://127.0.0.1:8000/api/orders",
        data=json.dumps(order_data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    order_res = json.loads(urllib.request.urlopen(post_req).read().decode())
    print(f"✅ Order Created Successfully: {order_res['order_number']} | Total: ₹{order_res['total_amount']} | Status: {order_res['status']}")
    assert order_res["total_amount"] == 390.0

    # 4. Test Order Tracking
    track_req = urllib.request.urlopen(f"http://127.0.0.1:8000/api/orders/{order_res['order_number']}")
    track_res = json.loads(track_req.read().decode())
    print(f"✅ Order Tracked Successfully: {track_res['order_number']} for {track_res['customer_name']}")
    assert track_res["customer_name"] == "Pooja Mehta"

    # 5. Test Party Inquiry
    party_data = {
        "customer_name": "Vikram Desai",
        "customer_phone": "9833445566",
        "event_date": "2026-10-15",
        "approx_guests": 50,
        "party_type": "Non-Veg Party (At Your Place Only)",
        "notes": "Need live wok setup for birthday celebration in Malad West"
    }
    party_req = urllib.request.Request(
        "http://127.0.0.1:8000/api/party/inquiry",
        data=json.dumps(party_data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    party_res = json.loads(urllib.request.urlopen(party_req).read().decode())
    print(f"✅ Party Inquiry Created: ID {party_res['id']} for {party_res['customer_name']} ({party_res['party_type']})")
    assert party_res["approx_guests"] == 50

    # 6. Test Dashboard Stats
    stats_req = urllib.request.urlopen("http://127.0.0.1:8000/api/dashboard/stats")
    stats_res = json.loads(stats_req.read().decode())
    print(f"✅ Dashboard Stats: Revenue ₹{stats_res['total_revenue']}, Orders: {stats_res['total_orders']}, AOV: ₹{stats_res['average_order_value']}")
    assert stats_res["total_orders"] >= 1
    assert "status_counts" in stats_res

    # 7. Test Order Status Update
    status_update_data = {"status": "Preparing in Wok"}
    patch_req = urllib.request.Request(
        f"http://127.0.0.1:8000/api/dashboard/orders/{order_res['id']}/status",
        data=json.dumps(status_update_data).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="PATCH"
    )
    status_res = json.loads(urllib.request.urlopen(patch_req).read().decode())
    print(f"✅ Order Status Updated: {status_res['status']}")
    assert status_res["status"] == "Preparing in Wok"

    # 8. Test Google Auth Sign In
    auth_data = {
        "email": "testuser@gmail.com",
        "name": "Test Customer",
        "picture": "https://lh3.googleusercontent.com/a/default-user"
    }
    auth_req = urllib.request.Request(
        "http://127.0.0.1:8000/api/auth/google",
        data=json.dumps(auth_data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    auth_res = json.loads(urllib.request.urlopen(auth_req).read().decode())
    print(f"✅ Google Auth API Verified: User {auth_res['user']['name']} ({auth_res['user']['email']}) | Token: {auth_res['token'][:16]}...")
    assert auth_res["user"]["email"] == "testuser@gmail.com"
    assert auth_res["token"].startswith("ye_")

    print("\n🎉 ALL BACKEND, SQLITE DATABASE, VALIDATION, AUTH AND DASHBOARD TESTS PASSED 100%!")

if __name__ == "__main__":
    test_full_system()
