import api from "@/lib/axios";
import { Epic } from "./type";
import z from "zod/v3";
import { EpicFormSchema } from "./schema";

export async function createEpic(values: z.infer<typeof EpicFormSchema>) {
  const response = await api.post("/epic", values);
  return response.data;
}

export async function findEpicsByProjectId(projectId?: string) {
  const response = await api.get(`/epic/project/${projectId}`);
  return response.data.body;
}

export async function findEpicById(id?: string): Promise<Epic> {
  const response = await api.get(`/epic/${id}`);
  return response.data.body;
}

export async function updateEpic(
  values: z.infer<typeof EpicFormSchema>,
  id?: string,
) {
  const response = await api.put(`/epic/${id}/update`, values);
  return response.data;
}

export async function deleteEpic(id?: string) {
  const response = await api.delete(`/epic/${id}`);
  return response.data;
}
