import { io, Socket } from "socket.io-client";

// In production the frontend is served by the backend, so same-origin works.
// In dev, point at the local backend (override with VITE_SERVER_URL).
const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  (import.meta.env.DEV ? "http://localhost:3000" : window.location.origin);

export function createSocket(): Socket {
  return io(SERVER_URL, { transports: ["websocket", "polling"] });
}

export { SERVER_URL };
