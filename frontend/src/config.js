// src/config.js
export const API_URL = (import.meta.env.VITE_API_URL || 'https://datquang-backend.onrender.com').replace(/\/+$/, '');
export const WS_URL = API_URL.replace(/^http/, 'ws');