import ProjectMembersList from "@/features/project-member/components/project-members-list";
import { useParams } from "react-router-dom";
import { useSetTitle } from "@/hooks/use-set-title";

export default function ProjectTeamPage() {
  const { projectId } = useParams();

  useSetTitle("프로젝트 팀", "이 프로젝트에서 협업하는 멤버들을 관리합니다.");

  return (
    <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto space-y-8">
      <div className="bg-card rounded-2xl shadow-xl shadow-foreground/5 border border-border/50 overflow-hidden">
        <ProjectMembersList projectId={projectId} />
      </div>
    </div>
  );
}
