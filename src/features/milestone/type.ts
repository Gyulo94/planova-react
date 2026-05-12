export type Milestone = {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  progress: number;
  taskCount: number;
  completedTasks: number;
  workspaceId: string;
  projectId: string;
  createdAt?: Date;
  updatedAt?: Date;
  epics?: import("../epic/type").Epic[];
};
