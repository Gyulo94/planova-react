import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";

export function useProjectSocket(projectId?: string) {
  const queryClient = useQueryClient();
  const socket = getSocket();

  useEffect(() => {
    if (!projectId) return;

    const handleConnect = () => {
      socket.emit("project:subscribe", projectId);
    };

    const handleTaskReordered = () => {
      queryClient.invalidateQueries({ queryKey: ["projectTasks", projectId] });
    };

    const handleTaskCreated = () => {
      queryClient.invalidateQueries({ queryKey: ["projectTasks", projectId] });
    };

    socket.on("connect", handleConnect);
    socket.on("task:reordered", handleTaskReordered);
    socket.on("task:created", handleTaskCreated);

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      if (socket.connected) {
        socket.emit("project:unsubscribe", projectId);
      }
      socket.off("connect", handleConnect);
      socket.off("task:reordered", handleTaskReordered);
      socket.off("task:created", handleTaskCreated);
    };
  }, [projectId, queryClient, socket]);
}
