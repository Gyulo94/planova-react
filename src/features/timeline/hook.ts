import { useMemo } from "react";
import { addDays, differenceInCalendarDays, startOfDay } from "date-fns";
import type { Task } from "@/features/task/type";
import { getTaskRange } from "./utils";
import { TimelineChartItem } from "./type";

const BAR_SIZE = 28;
const CHART_VERTICAL_PADDING = 56;

type TimelineSpacingOptions = {
  dayWidth?: number;
  rowGap?: number;
};

export function useTimelineData(
  tasks: Task[],
  { dayWidth = 120, rowGap = 12 }: TimelineSpacingOptions = {},
) {
  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => a.order - b.order),
    [tasks],
  );

  return useMemo(() => {
    if (sortedTasks.length === 0) {
      const today = startOfDay(new Date());
      return {
        chartData: [] as TimelineChartItem[],
        timelineStart: today,
        totalDays: 1,
        chartMinWidth: 900,
        chartHeight: 200,
      };
    }

    const ranges = sortedTasks.map((task) => ({
      task,
      ...getTaskRange(task),
    }));

    const minStart = ranges.reduce(
      (min, cur) => (cur.start < min ? cur.start : min),
      ranges[0].start,
    );
    const maxEnd = ranges.reduce(
      (max, cur) => (cur.end > max ? cur.end : max),
      ranges[0].end,
    );

    const timelineStart = addDays(minStart, -1);
    const timelineEnd = addDays(maxEnd, 1);
    const totalDays = Math.max(
      1,
      differenceInCalendarDays(timelineEnd, timelineStart) + 1,
    );

    const chartData: TimelineChartItem[] = ranges.map(
      ({ task, start, end }) => {
        const startOffset = differenceInCalendarDays(start, timelineStart);
        const duration = Math.max(1, differenceInCalendarDays(end, start) + 1);
        const safeProgress = Math.min(100, Math.max(0, task.progress ?? 0));

        let progressDuration = Number(
          ((duration * safeProgress) / 100).toFixed(2),
        );
        let remainingDuration = Number(
          (duration - progressDuration).toFixed(2),
        );

        if (safeProgress > 0 && progressDuration < 0.2) progressDuration = 0.2;
        if (safeProgress < 100 && remainingDuration < 0.2)
          remainingDuration = 0.2;

        return {
          id: task.id,
          taskLabel: task.title,
          taskNumber: task.taskNumber,
          startOffset,
          duration,
          progressDuration,
          remainingDuration,
          startDateLabel: start.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
          endDateLabel: end.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
          progress: safeProgress,
          status: task.status,
          priority: task.priority,
        };
      },
    );

    const chartMinWidth = totalDays * dayWidth;
    const chartHeight =
      chartData.length * (BAR_SIZE + rowGap) + CHART_VERTICAL_PADDING;

    return {
      chartData,
      timelineStart,
      totalDays,
      chartMinWidth,
      chartHeight,
      todayOffset: differenceInCalendarDays(
        startOfDay(new Date()),
        timelineStart,
      ),
    };
  }, [dayWidth, rowGap, sortedTasks]);
}
