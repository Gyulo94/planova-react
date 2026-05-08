import { io, Socket } from "socket.io-client";
import { SERVER_URL } from "@/lib/constants";

let socket: Socket | null = null;

function getSocketServerOrigin() {
  try {
    return new URL(SERVER_URL).origin;
  } catch {
    return SERVER_URL;
  }
}

export function getSocket(): Socket {
  if (!socket) {
    socket = io(getSocketServerOrigin(), {
      withCredentials: true,
      autoConnect: false,
      path: "/socket.io",
      transports: ["websocket"],
    });
  }
  return socket;
}
