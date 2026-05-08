// components/kanban/kanban-card.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import {
  CalendarIcon,
  EllipsisIcon,
  PencilIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import CircleAvatar from "@/components/ui/circle-avatar";
import { Task } from "../../type";
import { TaskPriorityConfig } from "../../enum";
import { DEFAULT_AVATAR } from "@/lib/constants";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface KanbanCardProps {
  task: Task;
  isAdmin?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onApprove?: (task: Task) => void;
}

export default function KanbanCard({
  task,
  isAdmin,
  onEdit,
  onDelete,
  onApprove,
}: KanbanCardProps) {
  const priority = TaskPriorityConfig[task.priority];
  const assignee = task.taskAssignee?.[0]?.user;
  const labels = task.taskLabel ?? [];

  return (
    <div className="group bg-card border border-border rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing">
      <div className="mb-3 flex items-center gap-2">
        <Badge variant="secondary" className="shrink-0 mt-0.5 text-center">
          # {task.taskNumber}
        </Badge>
        <Link
          to={`${task.id}`}
          className="min-w-0 flex-1 text-sm font-medium leading-snug line-clamp-1 text-foreground underline-offset-2 hover:underline"
        >
          {task.title}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 shrink-0"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            >
              <EllipsisIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            onCloseAutoFocus={(event) => event.preventDefault()}
          >
            <DropdownMenuItem onSelect={() => onEdit?.(task)}>
              <PencilIcon className="size-4" />
              수정
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => onDelete?.(task)}
            >
              <Trash2Icon className="size-4" />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {(task.epic || task.milestone) && (
        <div className="mb-3 flex justify-between flex-wrap gap-1.5">
          {task.epic && (
            <Badge
              variant="outline"
              className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 text-[10px] font-bold py-0 h-5 flex items-center gap-1 w-fit"
            >
              <span className="max-w-[120px] truncate">{task.epic.title}</span>
            </Badge>
          )}
          {task.milestone && (
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold py-0 h-5 flex items-center gap-1 w-fit"
            >
              <span className="max-w-[120px] truncate">
                {task.milestone.title}
              </span>
            </Badge>
          )}
        </div>
      )}

      <Progress value={task.progress} className="mb-3" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarIcon className="size-3.5" />
          <span>
            {task.dueDate
              ? format(new Date(task.dueDate), "yy.MM.dd")
              : "날짜 없음"}
          </span>
        </div>

        <Badge
          variant="outline"
          className={`text-xs font-medium ${priority.badgeClassName}`}
        >
          <span
            className={`mr-1.5 inline-block size-2 rounded-full ${priority.dotColor}`}
          />
          {priority.label}
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center min-w-0 flex-1 flex-wrap gap-1.5 pr-3">
          {labels.length > 0 ? (
            labels.map((taskLabel, index) => (
              <Badge
                key={
                  taskLabel.id ?? `${task.id}-${taskLabel.label.id}-${index}`
                }
                variant="outline"
                className="border-transparent text-xs font-medium"
                style={{
                  backgroundColor: taskLabel.label.bgColor,
                  color: taskLabel.label.textColor,
                }}
              >
                {taskLabel.label.name}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">라벨 없음</span>
          )}
        </div>

        <div className="flex items-center">
          {assignee ? (
            <CircleAvatar
              name={assignee.name || "Unknown User"}
              url={assignee.image || DEFAULT_AVATAR}
              size="sm"
            />
          ) : (
            <div className="size-7 rounded-full bg-muted flex items-center justify-center">
              <UserIcon className="size-3.5 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
      {task.status === "REVIEW" && isAdmin && (
        <div className="mt-3">
          <Button
            variant="primary"
            size="sm"
            className="w-full h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              onApprove?.(task);
            }}
          >
            승인하기
          </Button>
        </div>
      )}
    </div>
  );
}
