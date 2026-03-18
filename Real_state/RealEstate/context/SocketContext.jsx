import React, { createContext, useContext, useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "../lib/socket";
import { AuthContext } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user?._id) {
      const newSocket = connectSocket(user._id);
      setSocket(newSocket);

      return () => disconnectSocket();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);