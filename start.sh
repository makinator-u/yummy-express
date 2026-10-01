#!/bin/bash

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
echo "🚀 Starting Yummy Express..."

# ── Kill stale processes ──────────────────────────────────────────────────────
for PORT in 8000 5173; do
  PID=$(lsof -ti :$PORT)
  if [ -n "$PID" ]; then
    echo "⚠️  Killing old process on port $PORT (PID $PID)"
    kill -9 $PID 2>/dev/null
  fi
done
sleep 1

# ── Backend ───────────────────────────────────────────────────────────────────
echo "🍲 Backend  → http://localhost:8000"
cd "$PROJECT_ROOT"
./backend/venv/bin/python3 -m uvicorn backend.app.main:app \
  --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
sleep 2

# ── Frontend ──────────────────────────────────────────────────────────────────
echo "💻 Frontend → http://localhost:5173"
(cd "$PROJECT_ROOT/frontend" && npm run dev -- --host 0.0.0.0 --port 5173) &
FRONTEND_PID=$!

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🌐  http://localhost:5173   (website)"
echo "  📖  http://localhost:8000/docs  (api docs)"
echo "  CTRL+C to stop"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cleanup() {
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null
  exit 0
}
trap cleanup SIGINT SIGTERM
wait
