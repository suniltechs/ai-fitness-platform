import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/features/auth/AuthProvider";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useSocket = () => {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      // Join personal room
      socket.emit("join", user.id);
      // Join batch room if student
      if (user.batch) {
        socket.emit("joinBatch", user.batch);
      }
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, user]);

  return socketRef;
};
