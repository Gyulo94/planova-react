export type Comment = {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};
