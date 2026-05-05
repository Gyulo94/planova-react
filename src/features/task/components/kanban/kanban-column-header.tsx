// components/kanban/kanban-column-header.tsx
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { TaskStatusConfig } from "../../enum";
import { TaskStatusType } from "../../type";

interface KanbanColumnHeaderProps {
  status: TaskStatusType;
  taskCount: number;
  onAddTask?: () => void;
  addTaskDisabled?: boolean;
}

export default function KanbanColumnHeader({
  status,
  taskCount,
  onAddTask,
  addTaskDisabled = false,
}: KanbanColumnHeaderProps) {
  const config = TaskStatusConfig[status];

  return (
    <div className="px-3 py-2.5 flex items-center justify-between bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
      <div className="flex items-center gap-x-3">
        <div className={`p-1.5 rounded-md ${config.bgColor}`}>
          {<config.icon className={`size-4 ${config.color}-600`} />}
        </div>

        <div>
          <h3 className="font-semibold text-sm tracking-tight">
            {config.label}
          </h3>
        </div>

        <div className="size-5.5 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
          {taskCount}
        </div>
      </div>

      {!addTaskDisabled && (
        <Button
          onClick={onAddTask}
          variant="ghost"
          size="icon"
          className="size-8 hover:bg-muted-foreground/10"
        >
          <PlusIcon className="size-4" />
        </Button>
      )}
    </div>
  );
}
