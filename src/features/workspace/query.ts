import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWorkspace,
  deleteWorkspace,
  findWorkspaceById,
  findWorkspaces,
  resetInviteCode,
  updateWorkspace,
} from "./api";
import { Workspace } from "./type";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import z from "zod/v3";
import { WorkspaceFormSchema } from "./schema";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      navigate(`/workspaces/${data.body.id}`);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
  return mutation;
}

export function useFindWorkspaces() {
  const query = useQuery<Workspace[]>({
    queryKey: ["workspaces"],
    queryFn: findWorkspaces,
  });
  return query;
}

export function useFindWorkspaceById(workspaceId?: string) {
  const query = useQuery<Workspace>({
    queryKey: ["workspace", { workspaceId }],
    queryFn: () => findWorkspaceById(workspaceId),
    enabled: !!workspaceId,
  });
  return query;
}

export function useUpdateWorkspace(workspaceId?: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof WorkspaceFormSchema>) =>
      updateWorkspace(workspaceId, values),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({
        queryKey: ["workspace", { workspaceId }],
      });
      navigate(`/workspaces/${workspaceId}`);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
  return mutation;
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  const { data: workspaces } = useFindWorkspaces();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (workspaceId?: string) => deleteWorkspace(workspaceId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      navigate(
        workspaces && workspaces.length > 1
          ? `/workspaces/${workspaces[1].id}`
          : "/workspaces/new",
      );
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
  return mutation;
}

export function useResetInviteCode() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (workspaceId?: string) => resetInviteCode(workspaceId),
    onSuccess: (data, workspaceId) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({
        queryKey: ["workspace", { workspaceId }],
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
