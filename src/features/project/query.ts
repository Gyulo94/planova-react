import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import z from "zod/v3";
import { ProjectFormSchema } from "./schema";
import { createProject, findProjects } from "./api";
import { Project } from "./type";
import { useNavigate } from "react-router-dom";

export function useCreateProject(workspaceId?: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof ProjectFormSchema>) =>
      createProject(values, workspaceId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["projects", { workspaceId }],
      });
      navigate(`/workspaces/${workspaceId}/projects/${data.body.id}`);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
  return mutation;
}

export function useFindProjects(workspaceId?: string) {
  const query = useQuery<Project[]>({
    queryKey: ["projects", { workspaceId }],
    queryFn: () => findProjects(workspaceId),
  });
  return query;
}
