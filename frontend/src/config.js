// Địa chỉ Backend: đổi bằng biến môi trường VITE_API_URL (xem .env.example)
export const API_URL = (import.meta.env.VITE_API_URL || 'https://datquang-backend.onrender.com').replace(/\/+$/, '');
export const WS_URL = API_URL.replace(/^http/, 'ws');
