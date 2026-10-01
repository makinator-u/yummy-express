import os
import sys
from pathlib import Path

# Ensure backend and project root are in sys.path
backend_dir = str(Path(__file__).resolve().parent)
project_root = str(Path(__file__).resolve().parent.parent)
for p in [backend_dir, project_root]:
    if p not in sys.path:
        sys.path.insert(0, p)

from backend.app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
