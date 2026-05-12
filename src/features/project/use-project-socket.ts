import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";
import { useSession } from "@/features/user/query";

export function useProjectSocket(projectId?: string) {
  const queryClient = useQueryClient();
  const socket = getSocket();
  const { data: session } = useSession();

  useEffect(() => {
    if (!projectId) return;

    function handleConnect() {
      socket.emit("project:subscribe", projectId);
    }

    function handleTaskReordered() {
      queryClient.invalidateQueries({
        queryKey: ["projectTasks", { projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["projectTaskCounts", { projectId }],
      });
    }

    function handleTaskCreated() {
      queryClient.invalidateQueries({
        queryKey: ["projectTasks", { projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["projectTaskCounts", { projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["milestones", { projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["epics", { projectId }],
      });
    }

    function handleActivityCreated() {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    }

    function handleTaskUpdated(task: any) {
      queryClient.invalidateQueries({
        queryKey: ["projectTasks", { projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["task", { taskId: task.id }],
      });
      queryClient.invalidateQueries({
        queryKey: ["projectTaskCounts", { projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["milestones", { projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["epics", { projectId }],
      });
    }

    function handleTaskDeleted() {
      queryClient.invalidateQueries({
        queryKey: ["projectTasks", { projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["projectTaskCounts", { projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["milestones", { projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["epics", { projectId }],
      });
    }

    function handleProjectMemberUpdated() {
      queryClient.invalidateQueries({
        queryKey: ["project-member", { projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-workspace-members", { projectId }],
      });
    }

    function handleMilestoneUpdated() {
      queryClient.invalidateQueries({
        queryKey: ["milestones", { projectId }],
      });
    }

    function handleEpicUpdated() {
      queryClient.invalidateQueries({ queryKey: ["epics", { projectId }] });
    }

    function handleLabelCreated() {
      queryClient.invalidateQueries({
        queryKey: ["projectLabels", { projectId }],
      });
    }

    function handleUserUpdated(updatedUser: any) {
      if (updatedUser.id === session?.id) {
        queryClient.invalidateQueries({ queryKey: ["session"] });
      }

      queryClient.invalidateQueries({
        queryKey: ["project-member", { projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-workspace-members", { projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["projectTasks", { projectId }],
      });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    }

    socket.on("connect", handleConnect);
    socket.on("task:reordered", handleTaskReordered);
    socket.on("task:created", handleTaskCreated);
    socket.on("activity:created", handleActivityCreated);
    socket.on("task:updated", handleTaskUpdated);
    socket.on("task:deleted", handleTaskDeleted);
    socket.on("project:member_invited", handleProjectMemberUpdated);
    socket.on("project:member_removed", handleProjectMemberUpdated);
    socket.on("milestone:created", handleMilestoneUpdated);
    socket.on("milestone:updated", handleMilestoneUpdated);
    socket.on("milestone:deleted", handleMilestoneUpdated);
    socket.on("epic:created", handleEpicUpdated);
    socket.on("epic:updated", handleEpicUpdated);
    socket.on("epic:deleted", handleEpicUpdated);
    socket.on("label:created", handleLabelCreated);
    socket.on("user:updated", handleUserUpdated);

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
      socket.off("activity:created", handleActivityCreated);
      socket.off("task:updated", handleTaskUpdated);
      socket.off("task:deleted", handleTaskDeleted);
      socket.off("project:member_invited", handleProjectMemberUpdated);
      socket.off("project:member_removed", handleProjectMemberUpdated);
      socket.off("milestone:created", handleMilestoneUpdated);
      socket.off("milestone:updated", handleMilestoneUpdated);
      socket.off("milestone:deleted", handleMilestoneUpdated);
      socket.off("epic:created", handleEpicUpdated);
      socket.off("epic:updated", handleEpicUpdated);
      socket.off("epic:deleted", handleEpicUpdated);
      socket.off("label:created", handleLabelCreated);
      socket.off("user:updated", handleUserUpdated);
    };
  }, [projectId, queryClient, socket, session?.id]);
}
