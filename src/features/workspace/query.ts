import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWorkspace, findWorkspaceById, findWorkspaces } from "./api";
import { Workspace } from "./type";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  const query = useQuery({
    queryKey: ["workspace", { workspaceId }],
    queryFn: () => findWorkspaceById(workspaceId),
    enabled: !!workspaceId,
  });
  return query;
}
