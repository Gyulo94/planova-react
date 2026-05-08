import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { useProjectSocket } from "@/features/project/use-project-socket";
import { useFindTasksByProjectId } from "@/features/task/query";
import { useKanbanFilterStore } from "@/features/task/store";
import { filterTasks } from "@/features/task/utils";
import type { TaskStatusType } from "@/features/task/type";
import { useTimelineData } from "@/features/timeline/hook";
import { GanttChart } from "@/features/timeline/components/gantt-chart";
import { TimelineHeader } from "@/features/timeline/components/timeline-header";
import { TimelineFilter } from "@/features/timeline/components/timeline-filter";
import { useSetTitle } from "@/hooks/use-set-title";

export default function ProjectTimelinePage() {
  const { projectId } = useParams();
  const { data: tasks = [] } = useFindTasksByProjectId(projectId);
  const { search, assigneeIds, priorities, labelIds } = useKanbanFilterStore();

  useSetTitle("타임라인", "프로젝트 작업들의 일정 및 선후 관계 시각화");

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
    <div className="h-[calc(100vh-65px)] py-8 max-w-[1800px] mx-auto flex flex-col overflow-hidden">
      <Card className="flex-1 flex flex-col rounded-2xl bg-card shadow-xl shadow-foreground/5 border border-border/50 overflow-hidden">
        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-2">
            <div className="py-2">
              <TimelineFilter
                selectedStatuses={selectedStatuses}
                onToggleStatus={toggleStatus}
                dayWidth={dayWidth}
                onDayWidthChange={setDayWidth}
              />
            </div>
            <Separator className="opacity-50" />
          </div>

          {chartData.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-muted-foreground bg-muted/5">
              조회된 작업 데이터가 없습니다.
            </div>
          ) : (
            <ScrollArea className="w-full flex-1 min-h-0">
              <div className="relative px-6 pb-6" style={{ width: chartMinWidth + 48 }}>
                <TimelineHeader
                  timelineStart={timelineStart}
                  totalDays={totalDays}
                  dayWidth={dayWidth}
                />
                <div style={{ height: chartHeight }}>
                  <GanttChart
                    chartData={chartData}
                    timelineStart={timelineStart}
                    totalDays={totalDays}
                    hideXAxis
                  />
                </div>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
