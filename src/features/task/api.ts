import api from "@/lib/axios";
import z from "zod/v3";
import { TaskFormSchema } from "./schema";
import { TaskStatusType } from "./type";

export async function createTask(values: z.infer<typeof TaskFormSchema>) {
  const response = await api.post("/task/create", values);
  return response.data;
}

export async function findTask(id?: string) {
  const response = await api.get(`/task/${id}`);
  return response.data.body;
}

export async function findTasksByProjectId(projectId?: string) {
  const response = await api.get(`/task/project/${projectId}`);
  return response.data.body;
}

export async function updateTask(
  values: Partial<z.infer<typeof TaskFormSchema>>,
  id?: string,
) {
  const response = await api.put(`/task/${id}/update`, values);
  return response.data;
}

export async function deleteTask(id?: string) {
  const response = await api.delete(`/task/${id}/delete`);
  return response.data;
}

export async function reorderTasks(
  updates: {
    id: string;
    status: TaskStatusType;
    order: number;
  }[],
  projectId?: string,
) {
  const response = await api.put("/task/reorder", { projectId, updates });
  return response.data.body;
}

export async function updateTaskDescription(
  description: string,
  tempImageUrls: string[],
  id?: string,
) {
  const response = await api.put(`/task/${id}/description`, {
    description,
    tempImageUrls,
  });
  return response.data;
}

export async function createSubtask(title: string, id?: string) {
  const response = await api.post(`/subtasks/${id}`, { title });
  return response.data;
}

export async function updateSubtask(
  data: { title?: string; completed?: boolean },
  id?: string,
) {
  const response = await api.put(`/subtasks/${id}`, data);
  return response.data;
}

export async function deleteSubtask(id?: string) {
  const response = await api.delete(`/subtasks/${id}`);
  return response.data;
}

export async function approveTask(id?: string) {
  const response = await api.post(`/task/${id}/approve`);
  return response.data;
}
