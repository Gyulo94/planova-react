import { Project } from "../project/type";
import { TaskAssignee } from "../task-assignee/type";
import { Priority, TaskStatus } from "./enum";

export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];
export type PriorityType = (typeof Priority)[keyof typeof Priority];

export type TaskLabelItem = {
  id: string;
  name: string;
  bgColor: string;
  textColor: string;
};

export type TaskLabel = {
  id: string;
  taskId: string;
  labelId: string;
  label: TaskLabelItem;
};

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
  order: number;
  taskId: string;
};

export type Task = {
  id: string;
  taskNumber: number;
  title: string;
  description?: string;
  progress: number;
  status: TaskStatusType;
  priority: PriorityType;
  startDate: Date | null;
  dueDate: Date | null;
  completedAt: Date | null;
  order: number;
  projectId: string;
  epicId: string | null;
  milestoneId: string | null;
  requiredApprovals: number;
  createdAt: Date;
  updatedAt: Date;
  project: Project;
  epic?: import("../epic/type").Epic;
  milestone?: import("../milestone/type").Milestone;
  taskAssignee: TaskAssignee[];
  taskLabel: TaskLabel[];
  subtask: Subtask[];
};
