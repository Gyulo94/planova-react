import { useProjectSocket } from "@/hooks/use-project-socket";
import { useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import KanbanFilter from "@/features/project/components/kanban-filter";
import KanbanBoard from "@/features/task/components/kanban/kanban-board";
import {
  useFindTasksByProjectId,
  useReorderTasks,
} from "@/features/task/query";
import { Task, TaskStatusType } from "@/features/task/type";
import { useQueryClient } from "@tanstack/react-query";

export default function ProjectSprintPage() {
  const { projectId } = useParams();
  const { data: tasks = [], isLoading } = useFindTasksByProjectId(projectId);
  const { mutate: reorderTasks } = useReorderTasks();
  const queryClient = useQueryClient();

  useProjectSocket(projectId);

  const handleKanbanChange = (
    updates: {
      id: string;
      status: TaskStatusType;
      order: number;
    }[],
  ) => {
    if (projectId) {
      queryClient.setQueryData(
        ["projectTasks", projectId],
        (current: Task[] = []) =>
          current
            .map((task) => {
              const update = updates.find((item) => item.id === task.id);
              return update
                ? { ...task, status: update.status, order: update.order }
                : task;
            })
            .sort((a, b) => a.order - b.order),
      );
    }

    if (projectId) {
      reorderTasks({ projectId, updates });
    }
  };

  if (isLoading) return null;

  return (
    <div className="flex-1 w-full border rounded-lg bg-background h-[calc(100vh-16px)]">
      <div className="h-full flex flex-col overflow-auto p-4">
        <h1 className="text-lg font-semibold text-foreground">작업 목록</h1>
        <Separator className="my-4" />
        <KanbanFilter />
        <Separator className="my-4" />
        <KanbanBoard data={tasks} onChange={handleKanbanChange} />
      </div>
    </div>
  );
}
