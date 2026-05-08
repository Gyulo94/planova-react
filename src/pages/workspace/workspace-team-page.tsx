import WorkspaceMembersList from "@/features/workspace-member/components/workspace-members-list";
import { useParams } from "react-router-dom";
import { useSetTitle } from "@/hooks/use-set-title";

export default function WorkspaceTeamPage() {
  const { workspaceId } = useParams();

  useSetTitle("워크스페이스 팀", "워크스페이스의 모든 멤버를 관리하고 역할을 할당합니다.");

  return (
    <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto space-y-8">
      <div className="bg-card rounded-2xl shadow-xl shadow-foreground/5 border border-border/50 overflow-hidden">
        <WorkspaceMembersList workspaceId={workspaceId} />
      </div>
    </div>
  );
}
