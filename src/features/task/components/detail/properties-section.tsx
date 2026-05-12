import {
  CalendarIcon,
  UserIcon,
  TagIcon,
  FlagIcon,
  ActivityIcon,
  TargetIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CircleAvatar from "@/components/ui/circle-avatar";
import { TaskPriorityConfig, TaskStatusConfig } from "@/features/task/enum";
import { Task } from "@/features/task/type";
import { cn } from "@/lib/utils";
import { PropertyRow } from ".";
import { Progress } from "@/components/ui/progress";

interface PropertiesSectionProps {
  task: Task;
}

export default function PropertiesSection({ task }: PropertiesSectionProps) {
  const statusConfig = TaskStatusConfig[task.status];
  const priorityConfig = TaskPriorityConfig[task.priority];
  const StatusIcon = statusConfig.icon;

  const assignee = task.assignee;
  const label = task.label;

  const createdAt = new Date(task.createdAt).toLocaleDateString("ko-KR");
  const startDate = task.startDate
    ? new Date(task.startDate).toLocaleDateString("ko-KR")
    : "-";
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("ko-KR")
    : "-";

  return (
    <div className="mb-8 space-y-0.5">
      <div className="grid grid-cols-2 gap-x-2">
        <PropertyRow icon={<UserIcon className="size-4" />} label="담당자">
          <div className="flex items-center gap-1.5 flex-wrap">
            {assignee ? (
              <div className="flex items-center gap-1.5">
                <CircleAvatar
                  url={assignee.image ?? undefined}
                  name={assignee.name ?? assignee.email}
                  size="sm"
                />
                <span className="text-sm">{assignee.name ?? assignee.email}</span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">없음</span>
            )}
          </div>
        </PropertyRow>
        <PropertyRow icon={<TagIcon className="size-4" />} label="라벨">
          <div className="flex flex-wrap gap-1.5">
            {label ? (
              <Badge
                variant="secondary"
                className="text-xs"
                style={{
                  backgroundColor: label.bgColor,
                  color: label.textColor,
                }}
              >
                {label.name}
              </Badge>
            ) : (
              <span className="text-sm text-muted-foreground">없음</span>
            )}
          </div>
        </PropertyRow>
      </div>

      <div className="grid grid-cols-2 gap-x-2">
        <PropertyRow icon={<ActivityIcon className="size-4" />} label="상태">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-sm px-2.5 py-0.5 rounded-md font-medium",
              statusConfig.bgColor,
            )}
          >
            <StatusIcon className="size-3.5" />
            {statusConfig.label}
          </span>
        </PropertyRow>
        <PropertyRow icon={<FlagIcon className="size-4" />} label="우선순위">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-sm px-2.5 py-0.5 rounded-md border font-medium",
              priorityConfig.badgeClassName,
            )}
          >
            <span
              className={cn("h-2 w-2 rounded-full", priorityConfig.dotColor)}
            />
            {priorityConfig.label}
          </span>
        </PropertyRow>
      </div>

      <div className="grid grid-cols-2 gap-x-2">
        <PropertyRow icon={<CalendarIcon className="size-4" />} label="시작일">
          <span className="text-sm">{startDate}</span>
        </PropertyRow>
        <PropertyRow icon={<CalendarIcon className="size-4" />} label="마감일">
          <span className="text-sm text-orange-500 font-medium">{dueDate}</span>
        </PropertyRow>
      </div>

      <div className="grid grid-cols-2 gap-x-2">
        <PropertyRow icon={<ActivityIcon className="size-4" />} label="진행률">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <Progress value={task.progress} />
            </div>
            <span className="text-sm text-muted-foreground flex-shrink-0">
              {task.progress}%
            </span>
          </div>
        </PropertyRow>
        <PropertyRow icon={<CalendarIcon className="size-4" />} label="작성일">
          <span className="text-sm">{createdAt}</span>
        </PropertyRow>
      </div>

      {(task.epic) && (
        <div className="grid grid-cols-2 gap-x-2">
          {task.epic && (
            <PropertyRow icon={<TargetIcon className="size-4" />} label="에픽">
              <Badge
                variant="outline"
                className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 text-xs font-bold py-0.5 px-2 flex items-center gap-1 w-fit"
              >
                <span className="opacity-70 text-[10px]">EPIC</span>
                <span className="w-[1px] h-2 bg-violet-500/30" />
                <span>{task.epic.title}</span>
              </Badge>
            </PropertyRow>
          )}
          {task.epic?.milestone && (
            <PropertyRow icon={<TargetIcon className="size-4" />} label="마일스톤">
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-bold py-0.5 px-2 flex items-center gap-1 w-fit"
              >
                <span className="opacity-70 text-[10px]">MILESTONE</span>
                <span className="w-[1px] h-2 bg-emerald-500/30" />
                <span>{task.epic.milestone.title}</span>
              </Badge>
            </PropertyRow>
          )}
        </div>
      )}
    </div>
  );
}
