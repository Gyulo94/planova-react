import { KanbanFilter } from "@/features/project/components/kanban-filter";
import { FilterButton } from "@/features/project/components/kanban-filter";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TaskStatusConfig, TaskStatus } from "@/features/task/enum";
import type { TaskStatusType } from "@/features/task/type";

const DAY_WIDTH_OPTIONS = [40, 60, 80, 120];

interface TimelineFilterProps {
  selectedStatuses: TaskStatusType[];
  onToggleStatus: (status: TaskStatusType) => void;
  dayWidth: number;
  onDayWidthChange: (v: number) => void;
}

export function TimelineFilter({
  selectedStatuses,
  onToggleStatus,
  dayWidth,
  onDayWidthChange,
}: TimelineFilterProps) {
  return (
    <KanbanFilter
      extraFilters={
        <>
          <FilterButton
            label="상태"
            count={selectedStatuses.length}
            active={selectedStatuses.length > 0}
          >
            <div className="space-y-1">
              {Object.values(TaskStatus).map((status) => {
                const config = TaskStatusConfig[status];
                const Icon = config.icon;
                return (
                  <div
                    key={status}
                    onClick={() => onToggleStatus(status as TaskStatusType)}
                    className={`cursor-pointer w-full flex items-center gap-2 p-2 rounded hover:bg-accent transition-colors text-left ${
                      selectedStatuses.includes(status as TaskStatusType)
                        ? "bg-accent"
                        : ""
                    }`}
                  >
                    <Checkbox
                      checked={selectedStatuses.includes(
                        status as TaskStatusType,
                      )}
                      onCheckedChange={() =>
                        onToggleStatus(status as TaskStatusType)
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{config.label}</span>
                  </div>
                );
              })}
            </div>
          </FilterButton>

          <div className="ml-20 flex gap-1">
            <Label className="text-xs text-muted-foreground">날짜 간격</Label>
            <Select
              value={String(dayWidth)}
              onValueChange={(v) => onDayWidthChange(Number(v))}
            >
              <SelectTrigger className="h-8 w-[110px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom">
                {DAY_WIDTH_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt}px
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      }
    />
  );
}
