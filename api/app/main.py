import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal, init_db
from .seed_data import seed_database
from .routes import restaurant, menu, orders, party, dashboard, auth

# Startup: Create tables and seed DB safely on startup / module import
try:
    init_db()
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
except Exception as e:
    print("DB Init note on module import:", e)

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="YUMMY EXPRESS API",
    description="Backend API for Yummy Express Online Food Ordering System",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for all origins (supports Vercel preview & production URLs, localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers with /api prefix (for standard web requests)
app.include_router(restaurant.router, prefix="/api/restaurant")
app.include_router(menu.router, prefix="/api/menu")
app.include_router(orders.router, prefix="/api/orders")
app.include_router(party.router, prefix="/api/party")
app.include_router(dashboard.router, prefix="/api/dashboard")
app.include_router(auth.router, prefix="/api/auth")

# Also include Routers with root prefix (for Vercel serverless functions that forward stripped subpaths)
app.include_router(restaurant.router, prefix="/restaurant")
app.include_router(menu.router, prefix="/menu")
app.include_router(orders.router, prefix="/orders")
app.include_router(party.router, prefix="/party")
app.include_router(dashboard.router, prefix="/dashboard")
app.include_router(auth.router, prefix="/auth")

@app.get("/")
def read_root():
    return {
        "restaurant": "YUMMY EXPRESS",
        "tagline": "॥ श्री स्वामी समर्थ ॥",
        "status": "Online & Serving Fresh Indo-Chinese Wok Specialities",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "yummy-express-backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
