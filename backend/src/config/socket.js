import { Server } from "socket.io";

let ioInstance = null;

export const initSocket = (server, allowedOrigins) => {
  ioInstance = new Server(server, {
    cors: { origin: allowedOrigins, credentials: true },
  });
  return ioInstance;
};

export const getIO = () => {
  if (!ioInstance) throw new Error("Socket.IO no inicializado");
  return ioInstance;
};
