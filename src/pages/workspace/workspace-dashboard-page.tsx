import { useParams } from "react-router-dom";

export default function WorkspaceDashboardPage() {
  const { workspaceId } = useParams();

  return <div>WorkspaceDashboardPage, workspaceId: {workspaceId}</div>;
}
