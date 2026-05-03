import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWorkspace, findWorkspaces } from "./api";
import { Workspace } from "./type";
import { toast } from "sonner";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
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
