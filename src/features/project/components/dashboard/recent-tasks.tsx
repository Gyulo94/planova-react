import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import CircleAvatar from "@/components/ui/circle-avatar";
import { ClientRelativeDate } from ".";

import { Task } from "@/features/task/type";
import { DEFAULT_AVATAR } from "@/lib/constants";

const statusMap: Record<string, string> = {
  BACKLOG: "백로그",
  TODO: "할 일",
  IN_PROGRESS: "진행 중",
  REVIEW: "검토 중",
  DONE: "완료",
};

const statusVariants: Record<
  string,
  "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE"
> = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  REVIEW: "REVIEW",
  DONE: "DONE",
};

const priorityMap: Record<string, string> = {
  URGENT: "긴급",
  HIGH: "높음",
  MEDIUM: "보통",
  LOW: "낮음",
};

const priorityColors: Record<string, string> = {
  URGENT: "text-rose-500",
  HIGH: "text-orange-500",
  MEDIUM: "text-blue-500",
  LOW: "text-slate-400",
};

interface RecentTasksProps {
  tasks: Task[];
  workspaceId: string;
  projectId: string;
}

export default function RecentTasks({
  tasks,
  workspaceId,
  projectId,
}: RecentTasksProps) {
  const recentTasks = tasks.slice(0, 5);

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">최근 작업 ({tasks.length})</h3>
      </div>

      <ul className="flex flex-1 flex-col gap-y-3">
        {recentTasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center w-full mb-15">
            <p className="text-sm text-muted-foreground text-center">
              등록된 작업이 없습니다.
            </p>
          </div>
        ) : (
          recentTasks.map((task) => (
            <li key={task.id}>
              <Link
                to={`/workspaces/${workspaceId}/projects/${projectId}/tasks/${task.id}`}
              >
                <Card className="shadow-sm border-border/40 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 py-0 overflow-hidden group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-x-2 mb-2">
                      <p className="text-[15px] font-semibold truncate group-hover:text-primary transition-colors">
                        {task.title}
                      </p>
                      <Badge
                        variant={statusVariants[task.status] || "default"}
                        className="shrink-0 text-[10px] px-1.5 py-0 h-5"
                      >
                        {statusMap[task.status] || task.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-3">
                        <div className="text-[11px] text-muted-foreground flex items-center">
                          <CalendarIcon className="size-3 mr-1.5 opacity-70" />
                          <ClientRelativeDate date={task.createdAt} />
                        </div>

                        <div className="flex items-center gap-x-1">
                          <div
                            className={cn(
                              "size-1.5 rounded-full bg-current",
                              priorityColors[task.priority],
                            )}
                          />
                          <span
                            className={cn(
                              "text-[11px] font-medium",
                              priorityColors[task.priority],
                            )}
                          >
                            {priorityMap[task.priority]}
                          </span>
                        </div>
                      </div>

                      <div className="flex -space-x-2">
                        {task.assignee && (
                          <CircleAvatar
                            url={task.assignee.image ?? DEFAULT_AVATAR}
                            name={task.assignee.name ?? ""}
                            className="size-5 border-2 border-background"
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))
        )}
      </ul>

      {tasks.length > 5 && (
        <Button className="w-full mt-4" asChild>
          <Link to={`/workspaces/${workspaceId}/projects/${projectId}/tasks`}>
            더 보기
          </Link>
        </Button>
      )}
    </Card>
  );
}
