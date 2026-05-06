import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { useProjectSocket } from "@/hooks/use-project-socket";
import { useFindTasksByProjectId } from "@/features/task/query";
import { useKanbanFilterStore } from "@/features/task/store";
import { filterTasks } from "@/features/task/utils";
import type { TaskStatusType } from "@/features/task/type";
import { useTimelineData } from "@/features/timeline/hook";
import { GanttChart } from "@/features/timeline/components/gantt-chart";
import { TimelineFilter } from "@/features/timeline/components/timeline-filter";

export default function ProjectTimelinePage() {
  const { projectId } = useParams();
  const { data: tasks = [] } = useFindTasksByProjectId(projectId);
  const { search, assigneeIds, priorities, labelIds } = useKanbanFilterStore();

  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatusType[]>(
    [],
  );
  const [dayWidth, setDayWidth] = useState(120);

  useProjectSocket(projectId);

  const toggleStatus = (status: TaskStatusType) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  const filtered = filterTasks(tasks, {
    search,
    assigneeIds,
    priorities,
    labelIds,
  });
  const statusFiltered =
    selectedStatuses.length > 0
      ? filtered.filter((t) => selectedStatuses.includes(t.status))
      : filtered;

  const { chartData, timelineStart, totalDays, chartMinWidth, chartHeight } =
    useTimelineData(statusFiltered, { dayWidth });

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row flex-wrap justify-between gap-2">
        <div>
          <CardTitle>프로젝트 타임라인</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="px-6 pb-4">
          <Separator />
          <div className="py-4">
            <TimelineFilter
              selectedStatuses={selectedStatuses}
              onToggleStatus={toggleStatus}
              dayWidth={dayWidth}
              onDayWidthChange={setDayWidth}
            />
          </div>
          <Separator />
        </div>

        {chartData.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            등록된 작업이 없습니다.
          </div>
        ) : (
          <ScrollArea className="w-full">
            <div style={{ width: chartMinWidth, height: chartHeight }}>
              <GanttChart
                chartData={chartData}
                timelineStart={timelineStart}
                totalDays={totalDays}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
