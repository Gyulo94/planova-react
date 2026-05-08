import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, FolderIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { ClientRelativeDate } from ".";
import { Project } from "@/features/project/type";

interface RecentProjectsProps {
  projects: Project[];
  workspaceId: string;
}

export default function RecentProjects({
  projects,
  workspaceId,
}: RecentProjectsProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight">최근 프로젝트</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.length === 0 ? (
          <Card className="col-span-full py-20 border-dashed">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <FolderIcon className="size-10 mb-3 opacity-20" />
              <p className="text-sm">참여 중인 프로젝트가 없습니다.</p>
            </div>
          </Card>
        ) : (
          projects.slice(0, 4).map((project) => (
            <Link
              key={project.id}
              to={`/workspaces/${workspaceId}/projects/${project.id}`}
            >
              <Card className="h-full shadow-sm border-border/40 rounded-xl hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden group ">
                <CardContent className="p-5">
                  <div className="flex items-center gap-x-3 mb-4">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <FolderIcon className="size-5" />
                    </div>
                    <h4 className="font-bold text-[16px] truncate group-hover:text-primary transition-colors">
                      {project.name}
                    </h4>
                  </div>

                  <div className="text-[11px] text-muted-foreground flex items-center mt-6">
                    <CalendarIcon className="size-3 mr-1.5 opacity-70" />
                    <ClientRelativeDate date={project.createdAt} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
