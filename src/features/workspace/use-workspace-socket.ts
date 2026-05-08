import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";
import { useNavigate, useParams } from "react-router-dom";
import { useSession } from "@/features/user/query";
import { toast } from "sonner";
import { WorkspaceMember } from "@/features/workspace-member/type";

export function useWorkspaceSocket(workspaceId?: string) {
  const queryClient = useQueryClient();
  const socket = getSocket();
  const navigate = useNavigate();
  const { data: session } = useSession();
  const { projectId: currentProjectId } = useParams();

  useEffect(() => {
    if (!workspaceId) return;

    function handleConnect() {
      socket.emit("workspace:subscribe", workspaceId);
    }

    function handleMemberUpdated() {
      queryClient.invalidateQueries({
        queryKey: ["workspace-member", { workspaceId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-workspace-members"],
      });
    }

    function handleActivityCreated() {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    }

    function handleProjectCreated() {
      queryClient.invalidateQueries({
        queryKey: ["projects", { workspaceId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspaceStats", { workspaceId }],
      });
    }

    function handleTaskUpdated() {
      queryClient.invalidateQueries({
        queryKey: ["workspaceStats", { workspaceId }],
      });
    }

    function handleProjectMemberInvited(payload: {
      projectId: string;
      members: WorkspaceMember[];
    }) {
      queryClient.invalidateQueries({
        queryKey: ["projects", { workspaceId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-workspace-members"],
      });

      const isMe = payload.members.some((m) => m.userId === session?.id);
      if (isMe) {
        toast.info("새로운 프로젝트에 초대되었습니다.");
      }
    }

    function handleProjectMemberRemoved(payload: {
      projectId: string;
      memberId: string;
    }) {
      queryClient.invalidateQueries({
        queryKey: ["projects", { workspaceId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-workspace-members"],
      });

      if (payload.memberId === session?.id) {
        if (currentProjectId === payload.projectId) {
          navigate(`/workspaces/${workspaceId}`);
          toast.error("프로젝트에서 제외되어 워크스페이스로 이동합니다.");
        } else {
          toast.error("프로젝트에서 제외되었습니다.");
        }
      }
    }

    function handleWorkspaceMemberRemoved(memberId: string) {
      queryClient.invalidateQueries({
        queryKey: ["workspace-member", { workspaceId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["project-member"],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-workspace-members"],
      });

      if (memberId === session?.id) {
        navigate("/");
        toast.error("워크스페이스에서 제외되어 메인 페이지로 이동합니다.");
      }
    }

    socket.on("connect", handleConnect);
    socket.on("workspace:member_joined", handleMemberUpdated);
    socket.on("workspace:member_removed", handleWorkspaceMemberRemoved);
    socket.on("activity:created", handleActivityCreated);
    socket.on("project:created", handleProjectCreated);
    socket.on("workspace:task_updated", handleTaskUpdated);
    socket.on("project:member_invited", handleProjectMemberInvited);
    socket.on("project:member_removed", handleProjectMemberRemoved);

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      if (socket.connected) {
        socket.emit("workspace:unsubscribe", workspaceId);
      }
      socket.off("connect", handleConnect);
      socket.off("workspace:member_joined", handleMemberUpdated);
      socket.off("workspace:member_removed", handleWorkspaceMemberRemoved);
      socket.off("activity:created", handleActivityCreated);
      socket.off("project:created", handleProjectCreated);
      socket.off("workspace:task_updated", handleTaskUpdated);
      socket.off("project:member_invited", handleProjectMemberInvited);
      socket.off("project:member_removed", handleProjectMemberRemoved);
    };
  }, [
    workspaceId,
    queryClient,
    socket,
    session?.id,
    currentProjectId,
    navigate,
  ]);
}
