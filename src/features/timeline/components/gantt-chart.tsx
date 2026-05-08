import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo } from "react";
import { format } from "date-fns";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import type { TimelineChartItem } from "../type";
import { CombinedTaskBar } from "./gantt-bar";
import { GanttBarLabel } from "./gantt-bar-label";

const chartConfig = {
  startOffset: { label: "시작 오프셋", color: "transparent" },
  progressDuration: { label: "진행 구간" },
  remainingDuration: { label: "잔여 구간" },
} satisfies ChartConfig;

type GanttChartProps = {
  chartData: TimelineChartItem[];
  timelineStart: Date;
  totalDays: number;
  rowGap?: number;
  hideXAxis?: boolean;
};

export function GanttChart({
  chartData,
  timelineStart,
  totalDays,
  rowGap = 12,
  hideXAxis = false,
}: GanttChartProps) {
  const xAxisTicks = useMemo(
    () => Array.from({ length: totalDays }, (_, index) => index),
    [totalDays],
  );

  return (
    <ChartContainer config={chartConfig} className="h-full w-full p-0">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        barCategoryGap={rowGap}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        {!hideXAxis && (
          <XAxis
            type="number"
            domain={[0, totalDays]}
            ticks={xAxisTicks}
            tickFormatter={(value) => {
              const date = new Date(timelineStart);
              date.setDate(date.getDate() + Number(value));
              return format(date, "M/d");
            }}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={0}
          />
        )}
        {hideXAxis && (
          <XAxis
            type="number"
            domain={[0, totalDays]}
            ticks={xAxisTicks}
            hide
          />
        )}
        <YAxis type="category" dataKey="id" hide />

        <ChartTooltip
          cursor={false}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const data = payload[0]?.payload as TimelineChartItem;
            if (!data?.taskLabel) return null;
            return (
              <div className="rounded-lg border bg-background px-3 py-2 shadow-md space-y-1">
                <div className="font-medium text-sm">{data.taskLabel}</div>
                <div className="text-xs text-muted-foreground">
                  {data.startDateLabel} - {data.endDateLabel}
                </div>
                <div className="text-xs text-muted-foreground">
                  진행률 {data.progress}%
                </div>
              </div>
            );
          }}
        />

        <Bar
          dataKey="startOffset"
          stackId="timeline"
          fill="transparent"
          barSize={28}
        />
        <Bar
          dataKey="duration"
          stackId="timeline"
          barSize={28}
          shape={(props) => <CombinedTaskBar {...props} />}
        >
          <LabelList dataKey="taskLabel" content={GanttBarLabel} />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
