import apiClient, { api, isApiHttpError } from "@/lib/axios";
import { getCachedSession, setCachedSession } from "@/lib/session-storage";
import { Session } from "./type";
import z from "zod/v3";
import { UserProfileSchema } from "./schema";

export async function getSession(): Promise<Session | null> {
  try {
    const { data } = await apiClient.get("/user/session");

    const session = (data.body ?? null) as Session | null;
    setCachedSession(session);
    return session;
  } catch (error) {
    if (isApiHttpError(error)) {
      if (error.statusCode === 401 || error.statusCode === 403) {
        setCachedSession(null);
        return null;
      }
    }

    return getCachedSession() ?? null;
  }
}

export async function updateUser(values: z.infer<typeof UserProfileSchema>) {
  const response = await api.put("/user/update", values);
  return response.data;
}

export async function deleteUser() {
  const response = await api.delete("/user/delete");
  setCachedSession(null);
  return response.data;
}
