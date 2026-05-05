import api from "@/lib/axios";
import z from "zod/v3";
import { TaskFormSchema } from "./schema";
import { TaskStatusType } from "./type";

export async function createTask(values: z.infer<typeof TaskFormSchema>) {
  const response = await api.post("/task/create", values);
  return response.data.body;
}

export async function findTask(taskId?: string) {
  const response = await api.get(`/task/${taskId}`);
  return response.data.body;
}

export async function findTasksByProjectId(projectId?: string) {
  const response = await api.get(`/task/project/${projectId}`);
  return response.data.body;
}

export async function updateTask(values: {
  order: number;
  status: TaskStatusType;
  id: string;
}) {
  const { id: taskId, ...res } = values;
  const response = await api.put(`/task/${taskId}`, res);
  return response.data.body;
}

export async function reorderTasks(
  projectId: string,
  updates: {
    id: string;
    status: TaskStatusType;
    order: number;
  }[],
) {
  const response = await api.put("/task/reorder", { projectId, updates });
  return response.data.body;
}
