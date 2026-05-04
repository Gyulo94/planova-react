import { useFindProjectMembers } from "@/features/project-member/query";
import { NotFoundPage } from "@/pages";
import { Outlet, useParams } from "react-router-dom";

export default function ProjectRoute() {
  const { projectId } = useParams();
  const { isError, isLoading } = useFindProjectMembers(projectId);

  if (!projectId) {
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
