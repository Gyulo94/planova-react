import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import z from "zod/v3";
import {
  createTask,
  updateTask,
  reorderTasks,
  findTask,
  findTasksByProjectId,
  approveTask,
  createSubtask,
  updateSubtask,
  deleteTask,
} from "./api";
import { TaskFormSchema } from "./schema";
import { toast } from "sonner";
import { Task, TaskStatusType } from "./type";

export function useCreateTask() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof TaskFormSchema>) => createTask(values),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projectTasks"] });
      queryClient.invalidateQueries({
        queryKey: ["projectTaskCounts", { projectId: data.body.projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["milestones", { projectId: data.body.projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["epics", { projectId: data.body.projectId }],
      });

      toast.success(data.message);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });

  return mutation;
}

export function useFindTask(taskId?: string) {
  const query = useQuery<Task>({
    queryKey: ["task", { taskId }],
    queryFn: () => findTask(taskId),
    enabled: !!taskId,
  });
  return query;
}

export function useFindTasksByProjectId(projectId?: string) {
  const query = useQuery({
    queryKey: ["projectTasks", { projectId }],
    queryFn: () => findTasksByProjectId(projectId),
    enabled: !!projectId,
  });
  return query;
}

export function useUpdateTask(taskId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof TaskFormSchema>) =>
      updateTask(values, taskId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["task", { taskId: data.body.id }],
      });
      queryClient.invalidateQueries({ queryKey: ["projectTasks"] });
      queryClient.invalidateQueries({
        queryKey: ["projectTaskCounts", { projectId: data.body.projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["milestones", { projectId: data.body.projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["epics", { projectId: data.body.projectId }],
      });
      toast.success(data.message);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
  return mutation;
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id?: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectTasks"] });
      queryClient.invalidateQueries({ queryKey: ["projectTaskCounts"] });
      queryClient.invalidateQueries({ queryKey: ["epics"] });
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
  return mutation;
}

export function useReorderTasks() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      projectId,
      updates,
    }: {
      updates: { id: string; status: TaskStatusType; order: number }[];
      projectId?: string;
    }) => reorderTasks(updates, projectId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["projectTasks"] });
      queryClient.invalidateQueries({
        queryKey: ["projectTaskCounts", { projectId }],
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
  return mutation;
}

export function useCreateSubtask(taskId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ title }: { title: string }) => createSubtask(title, taskId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["task", { taskId }] });
      queryClient.invalidateQueries({ queryKey: ["projectTasks"] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
  return mutation;
}

export function useUpdateSubtask(taskId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { title?: string; completed?: boolean };
    }) => updateSubtask(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", { taskId }] });
      queryClient.invalidateQueries({ queryKey: ["projectTasks"] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
  return mutation;
}

export function useDeleteSubtask() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id }: { id: string; taskId: string }) =>
      import("./api").then((m) => m.deleteSubtask(id)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["task", { taskId: data.taskId }],
      });
      queryClient.invalidateQueries({ queryKey: ["projectTasks"] });
    },
  });
  return mutation;
}
export function useApproveTask() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id?: string) => approveTask(id),
    onSuccess: (data) => {
      const projectId = data.body.projectId;
      queryClient.setQueryData(["task", { id: data.body.id }], data);
      queryClient.setQueryData(
        ["projectTasks", { projectId }],
        (oldTasks: Task[] | undefined) => {
          if (!oldTasks) return oldTasks;
          return oldTasks.map((task) =>
            task.id === data.body.id ? data.body : task,
          );
        },
      );
      queryClient.invalidateQueries({
        queryKey: ["task", { id: data.body.id }],
      });
      queryClient.invalidateQueries({
        queryKey: ["projectTasks", { projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["projectTaskCounts", { projectId }],
      });
      toast.success(data.message);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
  return mutation;
}
