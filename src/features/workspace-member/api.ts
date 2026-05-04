import api from "@/lib/axios";

export async function findWorkspaceMembers(workspaceId?: string) {
  const response = await api.get(`/workspace-member/all/${workspaceId}`);
  return response.data.body;
}

export async function joinWorkspace(workspaceId?: string, inviteCode?: string) {
  const response = await api.post(`/workspace-member/join`, {
    workspaceId,
    inviteCode,
  });
  return response.data;
}

export async function updateWorkspaceMember(
  workspaceId?: string,
  memberId?: string,
) {
  const response = await api.put(
    `/workspace-member/${workspaceId}/member/${memberId}/update`,
  );
  return response.data;
}

export async function removeWorkspaceMember(
  workspaceId?: string,
  memberId?: string,
) {
  const response = await api.delete(
    `/workspace-member/${workspaceId}/member/${memberId}/remove`,
  );
  return response.data;
}
