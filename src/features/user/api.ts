import apiClient, { isApiHttpError } from "@/lib/axios";
import { getCachedSession, setCachedSession } from "@/lib/session-storage";
import { Session } from "./type";

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
