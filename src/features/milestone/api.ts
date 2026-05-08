import api from "@/lib/axios";
import { Milestone } from "./type";
import { MilestoneFormSchema } from "./schema";
import z from "zod/v3";

export async function createMilestone(
  values: z.infer<typeof MilestoneFormSchema>,
) {
  const response = await api.post("/milestone/create", values);
  return response.data;
}

export async function findMilestonesByProjectId(
  projectId?: string,
): Promise<Milestone[]> {
  if (!projectId) return [];
  const response = await api.get(`/milestone/project/${projectId}`);
  return response.data.body;
}

export async function findMilestoneById(id?: string): Promise<Milestone> {
  const response = await api.get(`/milestone/${id}`);
  return response.data.body;
}

export async function updateMilestone(
  values: z.infer<typeof MilestoneFormSchema>,
  id?: string,
) {
  const response = await api.put(`/milestone/${id}`, values);
  return response.data;
}

export async function deleteMilestone(id: string) {
  const response = await api.delete(`/milestone/${id}`);
  return response.data;
}
