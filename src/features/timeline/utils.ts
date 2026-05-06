import { addDays, isValid, startOfDay } from "date-fns";
import type { Task } from "@/features/task/type";
import { TaskStatusConfig } from "@/features/task/enum";

export function toDate(value: unknown): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value as string);
  return isValid(date) ? date : null;
}

export function getTaskRange(task: Task) {
  const createdAt = toDate(task.createdAt) ?? new Date();
  const start = toDate(task.startDate) ?? createdAt;
  const due = toDate(task.dueDate) ?? addDays(start, 1);

  return {
    start: startOfDay(start <= due ? start : due),
    end: startOfDay(start <= due ? due : start),
  };
}

export function getStatusStrongColor(status: Task["status"]): string {
  const tone = TaskStatusConfig[status]?.color;

  switch (tone) {
    case "blue":
      return "#3B82F6";
    case "amber":
      return "#F59E0B";
    case "indigo":
      return "#6366F1";
    case "emerald":
      return "#10B981";
    default:
      return "#3B82F6";
  }
}

export function getStatusSoftColor(status: Task["status"]): string {
  const alpha = status === "TODO" ? 0.45 : 0.32;
  const tone = TaskStatusConfig[status]?.color;

  switch (tone) {
    case "blue":
      return `rgba(59, 130, 246, ${alpha})`;
    case "amber":
      return `rgba(245, 158, 11, ${alpha})`;
    case "indigo":
      return `rgba(99, 102, 241, ${alpha})`;
    case "emerald":
      return `rgba(16, 185, 129, ${alpha})`;
    default:
      return `rgba(59, 130, 246, ${alpha})`;
  }
}

/** 자유로운 radius를 가진 rounded rect path 생성 */
export function roundedBar(
  x: number,
  y: number,
  w: number,
  h: number,
  rTL: number,
  rTR: number,
  rBR: number,
  rBL: number,
): string {
  if (w <= 0 || h <= 0) return "";

  const r = (v: number) => Math.min(v, w / 2, h / 2);
  const tl = r(rTL),
    tr = r(rTR),
    br = r(rBR),
    bl = r(rBL);

  return [
    `M ${x + tl} ${y}`,
    `H ${x + w - tr}`,
    `Q ${x + w} ${y} ${x + w} ${y + tr}`,
    `V ${y + h - br}`,
    `Q ${x + w} ${y + h} ${x + w - br} ${y + h}`,
    `H ${x + bl}`,
    `Q ${x} ${y + h} ${x} ${y + h - bl}`,
    `V ${y + tl}`,
    `Q ${x} ${y} ${x + tl} ${y}`,
    "Z",
  ].join(" ");
}
