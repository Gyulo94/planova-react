import { useFindActivitiesByProject } from "@/features/activity/query";
import {
  useFindProjectById,
  useFindTaskCountsByProjectId,
} from "@/features/project/query";
import { useFindTasksByProjectId } from "@/features/task/query";
import { useParams } from "react-router-dom";

import { useSetTitle } from "@/hooks/use-set-title";

import {
  ActivityLog,
  RecentTasks,
  StatsCards,
  TaskDistributionChart,
} from "@/features/project/components/dashboard";

import { useProjectSocket } from "@/features/project/use-project-socket";

export default function ProjectDashboardPage() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

  useProjectSocket(projectId);

  const { data: project } = useFindProjectById(projectId);
  const { data: counts } = useFindTaskCountsByProjectId(projectId);
  const { data: tasks = [] } = useFindTasksByProjectId(projectId);
  const { data: activities, isLoading: activitiesLoading } =
    useFindActivitiesByProject(projectId);

  useSetTitle(project?.name ? `${project.name} 대시보드` : "대시보드");

  const taskCounts = counts ?? {
    todo: 0,
    inProgress: 0,
    review: 0,
    done: 0,
    total: 0,
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-5 md:px-8 max-w-[1600px] mx-auto">
      <StatsCards taskCounts={taskCounts} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-2 lg:col-span-1 space-y-6">
          <TaskDistributionChart counts={taskCounts} />
        </div>
        <div className="col-span-2 lg:col-span-1 space-y-6">
          <RecentTasks
            tasks={tasks}
            workspaceId={workspaceId!}
            projectId={projectId!}
          />
        </div>
        <div className="col-span-2 lg:col-span-1 space-y-6">
          <ActivityLog activities={activities} isLoading={activitiesLoading} />
        </div>
      </div>
    </div>
  );
}
