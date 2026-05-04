import { useParams } from "react-router-dom";

export default function ProjectDashboardPage() {
  const { workspaceId, projectId } = useParams();
  return (
    <div>
      ProjectDashboardPage, {workspaceId}, {projectId}
    </div>
  );
}
