import { useFindWorkspaceMembers } from "@/features/workspace-member/query";
import { NotFoundPage } from "@/pages";
import { useWorkspaceSocket } from "@/features/workspace/use-workspace-socket";
import { Outlet, useParams } from "react-router-dom";

export default function WorkspaceRoute() {
  const { workspaceId } = useParams();
  useWorkspaceSocket(workspaceId);
  const { isError, isLoading } = useFindWorkspaceMembers(workspaceId);

  if (!workspaceId) {
    return <NotFoundPage />;
  }

  if (isLoading) {
    return null;
  }

  if (isError) {
    return <NotFoundPage />;
  }
  return <Outlet />;
}
