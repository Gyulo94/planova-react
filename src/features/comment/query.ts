import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  deleteComment,
  findCommentsByTaskId,
  updateComment,
} from "./api";

export function useComments(taskId: string) {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => findCommentsByTaskId(taskId),
    enabled: !!taskId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.taskId],
      });
    },
  });
}

export function useUpdateComment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      updateComment(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });
}

export function useDeleteComment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });
}
