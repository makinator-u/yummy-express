import os
from pathlib import Path
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# Auto-load .env file if present in workspace or parent directory
for candidate in [
    Path(__file__).resolve().parent.parent.parent / ".env",
    Path(__file__).resolve().parent.parent / ".env",
    Path(__file__).resolve().parent / ".env",
]:
    if candidate.is_file():
        try:
            with open(candidate, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip("\"'")
                        if k and k not in os.environ:
                            os.environ[k] = v
        except Exception:
            pass
        break

TURSO_DATABASE_URL = os.environ.get("TURSO_DATABASE_URL") or os.environ.get("DATABASE_URL")
TURSO_AUTH_TOKEN = os.environ.get("TURSO_AUTH_TOKEN") or os.environ.get("TURSO_TOKEN")


def create_app_engine():
    if TURSO_DATABASE_URL and ("turso.io" in TURSO_DATABASE_URL or "libsql" in TURSO_DATABASE_URL):
        raw_url = TURSO_DATABASE_URL.strip()
        
        # Strip protocol prefix to normalize host
        for prefix in ["sqlite+libsql://", "libsql://", "https://", "http://"]:
            if raw_url.startswith(prefix):
                raw_url = raw_url[len(prefix):]
                break

        # Strip query parameters if passed in URL
        host_part = raw_url.split("?")[0].rstrip("/")
        db_url = f"sqlite+libsql://{host_part}?secure=true"
        
        connect_args = {}
        if TURSO_AUTH_TOKEN:
            connect_args["auth_token"] = TURSO_AUTH_TOKEN.strip()
        
        try:
            return create_engine(
                db_url,
                connect_args=connect_args,
                echo=False
            )
        except Exception as e:
            print("Warning: Could not initialize Turso libSQL engine, falling back to SQLite:", e)

    # Default / Local SQLite Fallback
    if os.environ.get("VERCEL"):
        default_db = "/tmp/yummy_express.db"
    else:
        default_db = os.path.join(os.path.dirname(os.path.dirname(__file__)), "yummy_express.db")
    
    db_path = os.environ.get("DB_PATH", default_db)
    db_url = f"sqlite:///{db_path}"
    
    return create_engine(
        db_url,
        connect_args={"check_same_thread": False}
    )

engine = create_app_engine()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def init_db():
    from . import models
    Base.metadata.create_all(bind=engine)
    # Check and perform lightweight column migrations
    with engine.connect() as conn:
        try:
            result = conn.execute(text("PRAGMA table_info(orders);")).fetchall()
            columns = [col[1] for col in result]
            if "user_id" not in columns and len(columns) > 0:
                conn.execute(text("ALTER TABLE orders ADD COLUMN user_id INTEGER;"))
                conn.commit()
        except Exception as e:
            print("Auto migration note:", e)

def ensure_db_ready():
    init_db()
    from .seed_data import seed_database
    db = SessionLocal()
    try:
        seed_database(db)
    except Exception as e:
        print("Seed database note:", e)
    finally:
        db.close()

# Initialize immediately on module load
try:
    ensure_db_ready()
except Exception as e:
    print("Initial DB ready note:", e)

def get_db():
    ensure_db_ready()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

