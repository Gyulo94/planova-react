import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, getSession, updateUser } from "./api";
import { getCachedSession } from "@/lib/session-storage.ts";
import type { Session } from "@/features/user/type";
import { toast } from "sonner";

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

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error?.message);
    },
  });

  return mutation;
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["session"], null);
      toast.success(data.message);
      window.location.href = "/login";
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });

  return mutation;
}
