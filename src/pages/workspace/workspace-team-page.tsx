import MembersList from "@/features/workspace-member/components/members-list";
import { useParams } from "react-router-dom";

export default function WorkspaceTeamPage() {
  const { workspaceId } = useParams();
  return (
    <div className="w-full flex flex-col gap-4 ">
      <MembersList workspaceId={workspaceId} />
    </div>
  );
}
