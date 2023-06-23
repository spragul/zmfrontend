import React, { useContext, createContext } from "react";
import { io } from "socket.io-client";

const socket = io.connect("https://zoom-metting-backend.onrender.com");
const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export default function SocketProvider({ children }) {
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
