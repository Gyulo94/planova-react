import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { getSession } from "@/features/user/api";
import { setCachedSession } from "@/lib/session-storage";

export function useSocialCallback() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (searchParams.get("social") !== "1") return;
    setSearchParams({}, { replace: true });
    getSession().then((session) => {
      setCachedSession(session);
      queryClient.setQueryData(["session"], session);
    });
  }, []);
}
