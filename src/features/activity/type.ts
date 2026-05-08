export interface Activity {
  id: string;
  action: string;
  description: string;
  metadata?: any;
  workspaceId?: string;
  projectId?: string;
  taskId?: string;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
  };
}

export interface ActivityResponse {
  body: Activity[];
  message: string;
  statusCode: number;
}
