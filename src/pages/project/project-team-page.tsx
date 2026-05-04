import ProjectMembersList from "@/features/project-member/components/project-members-list";
import { useParams } from "react-router-dom";

export default function ProjectTeamPage() {
  const { projectId } = useParams();
  return (
    <div className="w-full flex flex-col gap-4 ">
      <ProjectMembersList projectId={projectId} />
    </div>
  );
}
