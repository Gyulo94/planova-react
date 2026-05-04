import api from "@/lib/axios";

export async function findProjectMembers(projectId?: string) {
  const response = await api.get(`/project-member/all/${projectId}`);
  return response.data.body;
}

export async function updateProjectMember(
  projectId?: string,
  memberId?: string,
) {
  const response = await api.put(
    `/project-member/${projectId}/member/${memberId}/update`,
  );
  return response.data;
}

export async function removeProjectMember(
  projectId?: string,
  memberId?: string,
) {
  const response = await api.delete(
    `/project-member/${projectId}/member/${memberId}/remove`,
  );
  return response.data;
}

export async function findAvailableWorkspaceMembers(projectId?: string) {
  const response = await api.get(
    `/project-member/${projectId}/workspace-members/available`,
  );
  return response.data.body;
}

export async function inviteProjectMembers(
  projectId?: string,
  userIds?: string[],
) {
  const response = await api.post(
    `/project-member/${projectId}/invite`,
    { userIds },
  );
  return response.data;
}
