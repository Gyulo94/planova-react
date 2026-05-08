import api from "@/lib/axios";
import { Activity } from "./type";

export async function findActivitiesByTask(taskId: string, page = 1, limit = 20) {
  const response = await api.get(`/activity/task/${taskId}`, {
    params: { page, limit },
  });
  return response.data.body as Activity[];
}

export async function findActivitiesByProject(projectId: string, page = 1, limit = 20) {
  const response = await api.get(`/activity/project/${projectId}`, {
    params: { page, limit },
  });
  return response.data.body as Activity[];
}

export async function findActivitiesByWorkspace(workspaceId: string, page = 1, limit = 20) {
  const response = await api.get(`/activity/workspace/${workspaceId}`, {
    params: { page, limit },
  });
  return response.data.body as Activity[];
}
