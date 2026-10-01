import os
import sys
from pathlib import Path

# Add current api directory, app directory, and project root to sys.path
api_dir = str(Path(__file__).resolve().parent)
app_dir = str(Path(__file__).resolve().parent / "app")
project_root = str(Path(__file__).resolve().parent.parent)

for p in [api_dir, app_dir, project_root]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from api.app.main import app
except Exception:
    try:
        from app.main import app
    except Exception:
        from backend.app.main import app
