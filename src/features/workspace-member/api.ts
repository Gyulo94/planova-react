import api from "@/lib/axios";

export async function findWorkspaceMembers(workspaceId?: string) {
  const response = await api.get(`/workspace-member/all/${workspaceId}`);
  return response.data.body;
}
