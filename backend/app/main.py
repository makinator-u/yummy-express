import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal, init_db
from .seed_data import seed_database
from .routes import restaurant, menu, orders, party, dashboard, auth

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and seed DB safely
    init_db()
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown: Clean up resources if needed

app = FastAPI(
    title="YUMMY EXPRESS API",
    description="Backend API for Yummy Express Online Food Ordering System",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS with explicit allowed origins & regex for local dev
allowed_origins_env = os.environ.get("CORS_ORIGINS", "")
allowed_origins = [orig.strip() for orig in allowed_origins_env.split(",") if orig.strip()] or [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(restaurant.router)
app.include_router(menu.router)
app.include_router(orders.router)
app.include_router(party.router)
app.include_router(dashboard.router)
app.include_router(auth.router)

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
