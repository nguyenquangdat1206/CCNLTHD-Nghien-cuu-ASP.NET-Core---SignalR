// src/realtime.js
import { WS_URL } from './config';

let socket = null;
let socketKey = null;
let pingInterval = null;
let reconnectTimeout = null;
const listeners = new Set();

const closeSocket = () => {
  clearInterval(pingInterval);
  clearTimeout(reconnectTimeout);
  if (socket) { socket.onclose = null; socket.close(); socket = null; }
  socketKey = null;
};

const connect = (key) => {
  closeSocket();
  socketKey = key;
  const ws = new WebSocket(`${WS_URL}/ws/${key}`);
  socket = ws;
  ws.onopen = () => {
    pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "ping_keep_alive" }));
    }, 30000);
  };
  ws.onmessage = (event) => {
    let data;
    try { data = JSON.parse(event.data); } catch (e) { return; }
    listeners.forEach((listener) => listener(data));
  };
  ws.onclose = () => {
    clearInterval(pingInterval);
    if (!localStorage.getItem('userInfo')) { socket = null; socketKey = null; return; }
    reconnectTimeout = setTimeout(() => connect(key), 3000);
  };
};

export const subscribeRealtime = (userInfo, listener) => {
  const key = `${userInfo.user_id}/${userInfo.role}`;
  if (socketKey !== key) connect(key);
  listeners.add(listener);
  return () => { listeners.delete(listener); }; // Hàm cleanup dùng trong useEffect
};

export const disconnectRealtime = () => closeSocket();