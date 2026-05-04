import { toast } from "sonner";
import {
  findProjectMembers,
  removeProjectMember,
  updateProjectMember,
  findAvailableWorkspaceMembers,
  inviteProjectMembers,
} from "./api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectMember } from "./type";

export function useFindProjectMembers(projectId?: string) {
  const query = useQuery<ProjectMember[]>({
    enabled: !!projectId,
    queryKey: ["project-member", { projectId }],
    queryFn: () => findProjectMembers(projectId),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return query;
}

export function useUpdateProjectMember(projectId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (memberId: string) => updateProjectMember(projectId, memberId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["project-member", { projectId }],
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

export function useRemoveProjectMember(projectId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (memberId: string) => removeProjectMember(projectId, memberId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["project-member", { projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-workspace-members", { projectId }],
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

export function useFindAvailableWorkspaceMembers(projectId?: string) {
  const query = useQuery({
    enabled: !!projectId,
    queryKey: ["available-workspace-members", { projectId }],
    queryFn: () => findAvailableWorkspaceMembers(projectId),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return query;
}

export function useInviteProjectMember(projectId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (userIds: string[]) => inviteProjectMembers(projectId, userIds),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["project-member", { projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-workspace-members", { projectId }],
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
