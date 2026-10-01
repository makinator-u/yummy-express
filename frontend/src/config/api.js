// API Base endpoint
// In local development, connects directly to FastAPI on localhost:8000 (with CORS enabled)
// In production (Vercel), uses relative '/api' routed by vercel.json rewrites
const isDev = import.meta.env.DEV;
export const API_BASE = import.meta.env.VITE_API_BASE || (isDev ? 'http://localhost:8000/api' : '/api');
