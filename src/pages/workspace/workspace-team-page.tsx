import WorkspaceMembersList from "@/features/workspace-member/components/workspace-members-list";
import { useParams } from "react-router-dom";

export default function WorkspaceTeamPage() {
  const { workspaceId } = useParams();
  return (
    <div className="w-full flex flex-col gap-4 ">
      <WorkspaceMembersList workspaceId={workspaceId} />
    </div>
  );
}
