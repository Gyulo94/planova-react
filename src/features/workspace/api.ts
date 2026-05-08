import z from "zod/v3";
import { WorkspaceFormSchema } from "./schema";
import api from "@/lib/axios";

export async function createWorkspace(
  values: z.infer<typeof WorkspaceFormSchema>,
) {
  const response = await api.post("/workspace/create", values);
  return response.data;
}

export async function findWorkspaces() {
  const response = await api.get("/workspace/all");
  return response.data.body;
}

export async function findWorkspaceById(workspaceId?: string) {
  const response = await api.get(`/workspace/${workspaceId}`);
  return response.data.body;
}

export async function updateWorkspace(
  workspaceId?: string,
  values?: z.infer<typeof WorkspaceFormSchema>,
) {
  const response = await api.put(`/workspace/${workspaceId}/update`, values);
  return response.data;
}

export async function deleteWorkspace(workspaceId?: string) {
  const response = await api.delete(`/workspace/${workspaceId}/delete`);
  return response.data;
}

export async function resetInviteCode(workspaceId?: string) {
  const response = await api.put(`/workspace/${workspaceId}/invite-code/reset`);
  return response.data;
}

export async function findWorkspaceStats(workspaceId?: string) {
  const response = await api.get(`/workspace/${workspaceId}/stats`);
  return response.data;
}
