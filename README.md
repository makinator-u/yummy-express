# 🍜 YUMMY EXPRESS - Online Food Ordering Platform

A full-stack, responsive Indo-Chinese food ordering web application for **YUMMY EXPRESS** (Liberty Garden, Malad West) built strictly according to the restaurant menu flyer and logo branding.

---

## 🎨 Theme & Color Palette
Matched directly to the brand logo and menu card:
- **Primary Glowing Gold / Amber:** `#FBBF24`, `#F59E0B`, `#EAB308`
- **Fiery Indo-Chinese Crimson:** `#EF4444`, `#DC2626`, `#B91C1C`
- **Matte Obsidian Black Background:** `#0A0B0E`, `#12141A`, `#1A1E28`
- **Auspicious Header:** `॥ श्री स्वामी समर्थ ॥`

---

## 🛠️ Tech Stack & Architecture

- **Backend:** [FastAPI](file:///Users/urvadesai/Menu/backend/app/main.py) with Python 3.14
- **Database:** SQLite (`yummy_express.db`) using SQLAlchemy ORM (all menu categories, items, half/full prices, orders, and party inquiries are stored dynamically in SQLite — **no extra hardcoding**).
- **Frontend:** [React](file:///Users/urvadesai/Menu/frontend/src/App.jsx) + Vite + Vanilla CSS design system tokens + Lucide Icons + Canvas Confetti.

---

## 📋 Features Implemented

1. **Dynamic Menu from SQLite:**
   - 60 authentic menu items across 4 categories (`Veg Soup`, `Veg Starters`, `Veg Rice`, `Veg Noodles`).
   - Dynamic portion switcher: **Half** vs **Full** with automatic price updates.
   - Items with only Full portion available (e.g., *Veg Crispy*, *Manchurian Paneer*, *Veg Lollipop*, *Paneer Chilli Rice*) are automatically handled and validated.
   - Spicy flame indicator (`🌶️`) and Bestseller crown tags (`⭐`).
2. **Search & Instant Filters:**
   - Real-time instant search across item names and ingredients.
   - One-click filter for **Bestsellers** & **Spicy Specials**.
   - Sticky category navigation bar.
3. **Interactive Cart & Drawer:**
   - Portion-aware items basket.
   - Free Delivery banner for Malad West area.
   - Quantity adjustments with live subtotal calculation.
   - Floating cart drawer on mobile & desktop.
4. **Instant Checkout & SQLite Order Processing:**
   - Full checkout form (Name, 10-digit Phone, Delivery Address/Landmark, Cooking Notes).
   - Order type toggle: **Free Home Delivery** vs **Takeaway Counter Pickup**.
   - Payment method selection: **Cash on Delivery** or **UPI / QR on Delivery**.
   - Unique Order ID generation (e.g., `YE-10293`).
   - Direct 1-click **WhatsApp Order Format Generator** sending pre-filled order details to kitchen hotline **`7249041603`**.
5. **Live Order Status Tracker:**
   - Interactive modal to track order journey: (1) Confirmed -> (2) Sizzling in Wok -> (3) Out for Delivery -> (4) Delivered.
6. **Party & Catering Inquiries:**
   - Form for **Veg Live Wok Catering** & **Non-Veg Parties (At Your Place Only)** as specified on the menu card.
   - Persists inquiry directly to SQLite database.

---

## 🚀 Running the Application

### 1. Run Everything with One Command
```bash
./start.sh
```

### 2. Or Run Separately:

**Backend (FastAPI):**
```bash
cd /Users/urvadesai/Menu
./backend/venv/bin/python3 -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```
- API Root: `http://127.0.0.1:8000`
- Interactive Swagger Docs: `http://127.0.0.1:8000/docs`

**Frontend (React + Vite):**
```bash
cd /Users/urvadesai/Menu/frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
Open `http://127.0.0.1:5173` or `http://127.0.0.1:5174` in your browser.

---

## 🧪 Automated Testing
Run the complete integration test suite:
```bash
./backend/venv/bin/python3 tests/test_direct.py
```
Or run the HTTP live server test suite:
```bash
./backend/venv/bin/python3 tests/test_system.py
```
