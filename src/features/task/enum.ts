import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
} from "lucide-react";

export const TaskStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  REVIEW: "REVIEW",
  DONE: "DONE",
};

export const Priority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
};

export const TaskPriorityConfig = {
  [Priority.LOW]: {
    label: "낮음",
    dotColor: "bg-slate-400",
    badgeClassName:
      "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300",
  },
  [Priority.MEDIUM]: {
    label: "보통",
    dotColor: "bg-blue-500",
    badgeClassName:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  },
  [Priority.HIGH]: {
    label: "높음",
    dotColor: "bg-orange-500",
    badgeClassName:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300",
  },
  [Priority.CRITICAL]: {
    label: "긴급",
    dotColor: "bg-rose-500",
    badgeClassName:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300",
  },
} as const;

export const TaskStatusConfig = {
  [TaskStatus.TODO]: {
    label: "할 일",
    icon: CircleDashedIcon,
    bgColor: "bg-blue-100 dark:bg-blue-950 text-blue-600",
    color: "blue",
  },
  [TaskStatus.IN_PROGRESS]: {
    label: "진행중",
    icon: CircleDotDashedIcon,
    bgColor: "bg-amber-100 dark:bg-amber-950 text-amber-600",
    color: "amber",
  },
  [TaskStatus.REVIEW]: {
    label: "검토중",
    icon: CircleDotIcon,
    bgColor: "bg-indigo-100 dark:bg-indigo-950 text-indigo-600",
    color: "indigo",
  },
  [TaskStatus.DONE]: {
    label: "완료",
    icon: CircleCheckIcon,
    bgColor: "bg-emerald-100 dark:bg-emerald-950 text-emerald-600",
    color: "emerald",
  },
} as const;
