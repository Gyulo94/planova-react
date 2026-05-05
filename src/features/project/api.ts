import z from "zod/v3";
import { ProjectFormSchema } from "./schema";
import api from "@/lib/axios";

export async function createProject(
  values: z.infer<typeof ProjectFormSchema>,
  workspaceId?: string,
) {
  const response = await api.post(`/project/create`, {
    ...values,
    workspaceId,
  });
  return response.data;
}

export async function findProjects(workspaceId?: string, userId?: string) {
  const response = await api.get(`/project/all/${workspaceId}`, {
    params: { userId },
  });
  return response.data.body;
}

export async function findProjectById(projectId?: string) {
  const response = await api.get(`/project/${projectId}`);
  return response.data.body;
}

export async function updateProject(
  projectId?: string,
  values?: z.infer<typeof ProjectFormSchema>,
) {
  const response = await api.put(`/project/${projectId}/update`, values);
  return response.data;
}

export async function deleteProject(projectId?: string) {
  const response = await api.delete(`/project/${projectId}/delete`);
  return response.data;
}

export async function findLabelsByProjectId(projectId?: string) {
  const response = await api.get(`/project/${projectId}/labels`);
  return response.data.body;
}

export async function createLabel(projectId?: string, name?: string) {
  const response = await api.post(`/label/create`, {
    name,
    projectId,
  });

  return response.data;
}
