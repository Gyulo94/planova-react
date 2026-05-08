export type Epic = {
  id: string;
  epicNumber: number;
  title: string;
  description?: string;
  progress: number;
  startDate: Date;
  dueDate: Date;
  completedAt?: Date;
  workspaceId: string;
  projectId: string;
  createdById: string;
  createdAt?: Date;
  updatedAt?: Date;
  taskCount: number;
  completedTasks: number;
};
