import { Project } from "../../type";
import { useFindProjectMembers } from "@/features/project-member/query";
import { ProjectMember } from "@/features/project-member/type";
import SquareAvatar from "@/components/ui/square-avatar";
import CircleAvatar from "@/components/ui/circle-avatar";
import { DEFAULT_AVATAR } from "@/lib/constants";
import { Card } from "@/components/ui/card";

interface ProjectDashboardHeaderProps {
  project?: Project;
}

export default function ProjectDashboardHeader({
  project,
}: ProjectDashboardHeaderProps) {
  const { data: projectMembers } = useFindProjectMembers(project?.id);
  const members: ProjectMember[] = projectMembers ?? [];
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SquareAvatar
            name={project?.name}
            url={project?.image}
            className="size-12 rounded-xl shadow-lg"
          />
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-1"> {project?.name}</h1>
            <p className="text-muted-foreground">
              프로젝트의 전반적인 현황과 최근 활동을 확인하세요.
            </p>
          </div>
        </div>
      </div>
      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <h3 className="text-sm font-medium">팀 멤버</h3>
          <div className="flex flex-wrap space-x-2">
            {members.map((member) => (
              <CircleAvatar
                key={member.id}
                name={member.user.name || "Unknown User"}
                url={member.user.image || DEFAULT_AVATAR}
                className="size-9 2xl:size-10 border-2 border-background shadow cursor-pointer"
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
