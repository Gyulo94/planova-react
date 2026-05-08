import { useQuery } from "@tanstack/react-query";
import { findActivitiesByTask, findActivitiesByProject, findActivitiesByWorkspace } from "./api";

export function useFindActivitiesByTask(taskId?: string) {
  return useQuery({
    queryKey: ["activities", "task", taskId],
    queryFn: () => findActivitiesByTask(taskId!),
    enabled: !!taskId,
  });
}

export function useFindActivitiesByProject(projectId?: string) {
  return useQuery({
    queryKey: ["activities", "project", projectId],
    queryFn: () => findActivitiesByProject(projectId!),
    enabled: !!projectId,
  });
}

export function useFindActivitiesByWorkspace(workspaceId?: string) {
  return useQuery({
    queryKey: ["activities", "workspace", workspaceId],
    queryFn: () => findActivitiesByWorkspace(workspaceId!),
    enabled: !!workspaceId,
  });
}
