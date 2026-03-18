import { io } from "socket.io-client";
import { BASE_URL } from "../config/Ip";

let socket;

export const connectSocket = (userId) => {
  socket = io(BASE_URL, {
    query: { userId },
    transports: ["websocket"],
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};