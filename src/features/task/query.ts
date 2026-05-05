import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import z from "zod/v3";
import {
  createTask,
  updateTask,
  reorderTasks,
  findTask,
  findTasksByProjectId,
} from "./api";
import { TaskFormSchema } from "./schema";
import { toast } from "sonner";
import { TaskStatusType } from "./type";

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: z.infer<typeof TaskFormSchema>) => createTask(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useFindTask(taskId: string | undefined) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => findTask(taskId!),
    enabled: !!taskId,
  });
}

export function useFindTasksByProjectId(projectId?: string) {
  return useQuery({
    queryKey: ["projectTasks", projectId],
    queryFn: () => findTasksByProjectId(projectId),
    enabled: !!projectId,
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: {
      order: number;
      status: TaskStatusType;
      id: string;
    }) => updateTask(values),
    onSuccess: (_, task) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({
        queryKey: ["task", { taskId: task.id }],
      });
      queryClient.invalidateQueries({ queryKey: ["projectTasks"] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
}

export function useReorderTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      updates,
    }: {
      projectId: string;
      updates: { id: string; status: TaskStatusType; order: number }[];
    }) => reorderTasks(projectId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectTasks"] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
}
