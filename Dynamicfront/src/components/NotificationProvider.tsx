import { useEffect, type ReactNode } from "react";
import toast from "react-hot-toast";
import { useSocket } from "@/hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";
import { Dumbbell, Megaphone } from "lucide-react";

const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleWorkout = (data: { message?: string }) => {
      toast(
        <div className="flex items-center gap-2">
          <Dumbbell className="w-4 h-4 text-indigo-400" />
          <span>{data.message || "New workout assigned!"}</span>
        </div>,
        {
          duration: 5000,
          style: {
            background: "#1e1b4b",
            color: "#c7d2fe",
            border: "1px solid #4338ca",
          },
        },
      );
      queryClient.invalidateQueries({ queryKey: ["myWorkouts"] });
    };

    const handleAnnouncement = (data: { title?: string }) => {
      toast(
        <div className="flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-amber-400" />
          <span>{data.title || "New announcement!"}</span>
        </div>,
        {
          duration: 5000,
          style: {
            background: "#1c1917",
            color: "#fde68a",
            border: "1px solid #b45309",
          },
        },
      );
      queryClient.invalidateQueries({ queryKey: ["myAnnouncements"] });
    };

    socket.on("workoutAssigned", handleWorkout);
    socket.on("announcement", handleAnnouncement);

    return () => {
      socket.off("workoutAssigned", handleWorkout);
      socket.off("announcement", handleAnnouncement);
    };
  }, [socketRef.current]);

  return <>{children}</>;
};

export default NotificationProvider;
