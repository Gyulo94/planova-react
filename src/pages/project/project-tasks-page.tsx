import { useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { KanbanFilter } from "@/features/project/components/kanban-filter";
import {
  useFindTasksByProjectId,
  useReorderTasks,
} from "@/features/task/query";
import { Task, TaskStatusType } from "@/features/task/type";
import { useQueryClient } from "@tanstack/react-query";
import { filterTasks } from "@/features/task/utils";
import { useKanbanFilterStore } from "@/features/task/store";
import { KanbanBoard } from "@/features/task/components/kanban";
import { useProjectSocket } from "@/features/project/use-project-socket";

import { useSetTitle } from "@/hooks/use-set-title";

export default function ProjectTasksPage() {
  const { projectId } = useParams();
  useProjectSocket(projectId);
  const { data: tasks = [], isLoading } = useFindTasksByProjectId(projectId);
  const { mutate: reorderTasks } = useReorderTasks();
  const queryClient = useQueryClient();
  const { search, assigneeIds, priorities, labelIds } = useKanbanFilterStore();

  useSetTitle(
    "작업 목록",
    "칸반 보드를 통한 프로젝트 작업 관리 및 진행 상황 추적",
  );

  const filteredTasks = filterTasks(tasks, {
    search,
    assigneeIds,
    priorities,
    labelIds,
  });

  const handleKanbanChange = (
    updates: {
      id: string;
      status: TaskStatusType;
      order: number;
    }[],
  ) => {
    if (projectId) {
      queryClient.setQueryData(
        ["projectTasks", { projectId }],
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
    <div className="flex flex-col overflow-hidden">
      <div className="mt-3 flex justify-end shrink-0">
        <div className="py-3.5 flex-1 rounded-2xl bg-card shadow-xl shadow-foreground/5 border border-border/50 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden p-6 py-2">
            <KanbanFilter />
            <Separator className="my-4 opacity-50" />
            <div className="flex-1 overflow-hidden">
              <KanbanBoard data={filteredTasks} onChange={handleKanbanChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
