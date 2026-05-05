// components/kanban/kanban-card.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
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

interface KanbanCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export default function KanbanCard({
  task,
  onEdit,
  onDelete,
}: KanbanCardProps) {
  const priority = TaskPriorityConfig[task.priority];
  const assignee = task.taskAssignee?.[0]?.user;
  const labels = task.taskLabel ?? [];

  return (
    <div className="group bg-card border border-border rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing">
      <div className="mb-3 flex items-start gap-2">
        <p className="min-w-0 flex-1 text-sm font-medium leading-snug line-clamp-2 text-foreground">
          {task.title}
        </p>
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
              태스크 수정
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => onDelete?.(task)}
            >
              <Trash2Icon className="size-4" />
              태스크 삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Separator className="mb-3" />

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
        <div className="flex min-w-0 flex-1 flex-wrap gap-1.5 pr-3">
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
    </div>
  );
}
