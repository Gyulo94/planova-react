import { Project } from "../project/type";
import { Session } from "../user/type";
import { Label } from "../label/type";
import { Priority, TaskStatus } from "./enum";

export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];
export type PriorityType = (typeof Priority)[keyof typeof Priority];

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
  requiredApprovals: number;
  createdAt: Date;
  updatedAt: Date;
  project: Project;
  epic?: import("../epic/type").Epic;
  assigneeId?: string | null;
  assignee?: Session;
  labelId?: string | null;
  label?: Label;
  subtask: Subtask[];
};
