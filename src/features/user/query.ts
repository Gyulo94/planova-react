import { useQuery } from "@tanstack/react-query";
import { getSession } from "./api";
import { getCachedSession } from "@/lib/session-storage.ts";
import type { Session } from "@/features/user/type";

export function useSession() {
  const query = useQuery<Session | null>({
    queryKey: ["session"],
    queryFn: getSession,
    enabled: true,
    initialData: getCachedSession,
    staleTime: 0,
    refetchOnMount: true,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return query;
}
