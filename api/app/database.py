import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase

if os.environ.get("VERCEL"):
    default_db = "/tmp/yummy_express.db"
else:
    default_db = os.path.join(os.path.dirname(os.path.dirname(__file__)), "yummy_express.db")

DB_PATH = os.environ.get("DB_PATH", default_db)
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def init_db():
    Base.metadata.create_all(bind=engine)
    # Check and perform lightweight SQLite column migrations
    with engine.connect() as conn:
        try:
            # Check if user_id column exists on orders table
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
