import { useFindWorkspaceMembers } from "@/features/workspace-member/query";
import { NotFoundPage } from "@/pages";
import { Outlet, useParams } from "react-router-dom";

export default function WorkspaceRoute() {
  const { workspaceId } = useParams();
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
