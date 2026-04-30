import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, register, registerVerifyMail } from "./api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getSession } from "@/features/user/api";
import { setCachedSession } from "@/lib/session-storage";

export function useRegister() {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/login");
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
  return mutation;
}

export function useRegisterVerifyMail() {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (token: string | undefined) => registerVerifyMail(token),
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/");
    },
  });
  return mutation;
}

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      const session = await getSession();
      setCachedSession(session);
      queryClient.setQueryData(["session"], session);
      navigate("/");
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
  return mutation;
}
