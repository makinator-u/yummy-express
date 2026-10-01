#!/bin/bash

# Kill anything already on port 8000
echo "🔍 Checking port 8000..."
PID=$(lsof -ti :8000)
if [ -n "$PID" ]; then
  echo "⚠️  Killing old process on port 8000 (PID $PID)"
  kill -9 $PID 2>/dev/null
  sleep 1
fi

echo "🍲 Starting FastAPI backend → http://localhost:8000"
echo "   API Docs → http://localhost:8000/docs"
echo ""

cd "$(dirname "$0")"
./backend/venv/bin/python3 -m uvicorn backend.app.main:app \
  --host 0.0.0.0 --port 8000 --reload
