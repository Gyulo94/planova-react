import type { Session } from "../features/user/type";
import { SESSION_STORAGE_KEY } from "./constants";

export function getCachedSession(): Session | null | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const cached = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!cached) {
    return undefined;
  }

  try {
    return JSON.parse(cached) as Session;
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return undefined;
  }
}

export function hasCachedSession() {
  return getCachedSession() !== undefined;
}

export function setCachedSession(session: Session | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (session) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return;
  }

  localStorage.removeItem(SESSION_STORAGE_KEY);
}
