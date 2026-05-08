import { useFindActivitiesByWorkspace } from "@/features/activity/query";
import { useFindProjects } from "@/features/project/query";
import {
  ActivityFeed,
  RecentProjects,
  StatsCards,
} from "@/features/workspace/components/dashboard";
import {
  useFindWorkspaceById,
  useFindWorkspaceStats,
} from "@/features/workspace/query";
import { useParams } from "react-router-dom";
import { useSetTitle } from "@/hooks/use-set-title";

export default function WorkspaceDashboardPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const { data: workspace } = useFindWorkspaceById(workspaceId);
  const { data: statsData } = useFindWorkspaceStats(workspaceId);
  const { data: projects = [] } = useFindProjects(workspaceId);
  const { data: activities, isLoading: activitiesLoading } =
    useFindActivitiesByWorkspace(workspaceId);

  useSetTitle(workspace?.name ? `${workspace.name} 대시보드` : "대시보드");

  const stats = statsData?.body ?? {
    projects: 0,
    members: 0,
    todo: 0,
    inProgress: 0,
    review: 0,
    done: 0,
    total: 0,
  };

  return (
    <div className="flex flex-col gap-8 px-4 md:px-8 py-5 max-w-[1600px] justify-center mx-auto">
      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <RecentProjects projects={projects} workspaceId={workspaceId!} />
        </div>
        <ActivityFeed
          activities={activities}
          isLoading={activitiesLoading}
          workspaceId={workspaceId!}
        />
      </div>
    </div>
  );
}
