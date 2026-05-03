import z from "zod/v3";
import { ProjectFormSchema } from "./schema";
import api from "@/lib/axios";

export async function createProject(
  values: z.infer<typeof ProjectFormSchema>,
  workspaceId?: string,
) {
  const response = await api.post(`/project/create`, {
    ...values,
    workspaceId,
  });
  return response.data;
}

export async function findProjects(workspaceId?: string) {
  const response = await api.get(`/project/all/${workspaceId}`);
  return response.data.body;
}
