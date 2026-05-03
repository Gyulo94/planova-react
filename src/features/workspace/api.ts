import z from "zod/v3";
import { WorkspaceFormSchema } from "./schema";
import api from "@/lib/axios";

export async function createWorkspace(
  values: z.infer<typeof WorkspaceFormSchema>,
) {
  const response = await api.post("/workspace/create", values);
  return response.data;
}

export async function findWorkspaces() {
  const response = await api.get("/workspace/all");
  return response.data.body;
}
