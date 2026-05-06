import { Task } from "../task/type";
import { Session } from "../user/type";

export type TaskAssignee = {
  id: string;
  taskId: string;
  userId: string;
  task: Task;
  user: Session;
};
