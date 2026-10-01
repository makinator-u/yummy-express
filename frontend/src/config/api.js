// Base API endpoint for backend service calls.
// Defaults to relative '/api' in production/Vercel (routed to backend service via vercel.json rewrites)
// Can also be overridden via VITE_API_BASE environment variable.
export const API_BASE = import.meta.env.VITE_API_BASE || '/api';
