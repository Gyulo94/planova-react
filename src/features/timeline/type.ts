import { Task } from "../task/type";

export type TimelineChartItem = {
  id: string;
  taskLabel: string;
  startOffset: number;
  progressDuration: number;
  remainingDuration: number;
  startDateLabel: string;
  endDateLabel: string;
  progress: number;
  status: Task["status"];
};
