import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import z from "zod/v3";
import { ProjectFormSchema } from "./schema";
import {
  createProject,
  createLabel,
  deleteProject,
  findProjectById,
  findProjects,
  updateProject,
  findLabelsByProjectId,
  findTaskCountsByProjectId,
} from "./api";
import { Project } from "./type";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/use-local-storage";

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

export function useFindProjects(workspaceId?: string, userId?: string) {
  const query = useQuery<Project[]>({
    queryKey: ["projects", { workspaceId, userId }],
    queryFn: () => findProjects(workspaceId, userId),
  });
  return query;
}

export function useFindProjectById(projectId?: string) {
  const query = useQuery<Project>({
    queryKey: ["project", { projectId }],
    queryFn: () => findProjectById(projectId),
    enabled: !!projectId,
  });
  return query;
}

export function useUpdateProject(projectId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof ProjectFormSchema>) =>
      updateProject(projectId, values),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", { projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["projectTaskCounts", { projectId }],
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

export function useDeleteProject(workspaceId?: string) {
  const queryClient = useQueryClient();
  const { removeValue } = useLocalStorage(
    `selected-project:${workspaceId}`,
    null,
  );
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (projectId?: string) => deleteProject(projectId),
    onSuccess: (data) => {
      toast.success(data.message);
      removeValue();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate(`/`);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
  return mutation;
}

export function useFindLabelsByProjectId(projectId?: string) {
  const query = useQuery({
    queryKey: ["projectLabels", { projectId }],
    queryFn: () => findLabelsByProjectId(projectId),
    enabled: !!projectId,
  });
  return query;
}

export function useCreateLabelByProjectId(projectId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (name: string) => createLabel(projectId, name),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["projectLabels", { projectId }],
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

export function useFindTaskCountsByProjectId(projectId?: string) {
  const query = useQuery({
    queryKey: ["projectTaskCounts", { projectId }],
    queryFn: () => findTaskCountsByProjectId(projectId),
    enabled: !!projectId,
  });
  return query;
}
