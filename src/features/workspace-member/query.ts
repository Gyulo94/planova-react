import { useQuery } from "@tanstack/react-query";
import { findWorkspaceMembers } from "./api";
import { WorkspaceMember } from "./type";

export function useFindWorkspaceMembers(workspaceId?: string) {
  const query = useQuery<WorkspaceMember[]>({
    enabled: !!workspaceId,
    queryKey: ["workspace-member", { workspaceId }],
    queryFn: () => findWorkspaceMembers(workspaceId),
  });
  return query;
}
