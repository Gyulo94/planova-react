import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  findWorkspaceMembers,
  joinWorkspace,
  removeWorkspaceMember,
  updateWorkspaceMember,
} from "./api";
import { WorkspaceMember } from "./type";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useFindWorkspaceMembers(workspaceId?: string) {
  const query = useQuery<WorkspaceMember[]>({
    enabled: !!workspaceId,
    queryKey: ["workspace-member", { workspaceId }],
    queryFn: () => findWorkspaceMembers(workspaceId),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return query;
}

export function useJoinWorkspace(workspaceId?: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: (inviteCode: string) => joinWorkspace(workspaceId, inviteCode),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["workspace-member", { workspaceId }],
      });
      navigate(`/workspaces/${workspaceId}`);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
        navigate("/");
      }
    },
  });
  return query;
}

export function useUpdateWorkspaceMember(workspaceId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (memberId: string) =>
      updateWorkspaceMember(workspaceId, memberId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["workspace-member", { workspaceId }],
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
  return mutation;
}

export function useRemoveWorkspaceMember(workspaceId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (memberId: string) =>
      removeWorkspaceMember(workspaceId, memberId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["workspace-member", { workspaceId }],
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
  return mutation;
}
