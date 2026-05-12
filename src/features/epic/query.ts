import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEpic,
  deleteEpic,
  findEpicById,
  findEpicsByProjectId,
  updateEpic,
} from "./api";
import { toast } from "sonner";
import z from "zod/v3";
import { EpicFormSchema } from "./schema";
import { Epic } from "./type";

export function useFindEpics(projectId?: string) {
  const query = useQuery({
    queryKey: ["epics", { projectId }],
    queryFn: () => findEpicsByProjectId(projectId),
    enabled: !!projectId,
  });
  return query;
}

export function useFindEpic(id?: string) {
  const query = useQuery<Epic>({
    queryKey: ["epic", { id }],
    queryFn: () => findEpicById(id!),
    enabled: !!id,
  });
  return query;
}

export function useCreateEpic() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createEpic,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["epics", { projectId: data.body.projectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["milestones", { projectId: data.body.projectId }],
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

export function useUpdateEpic(id?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof EpicFormSchema>) =>
      updateEpic(values, id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["epics"] });
      queryClient.invalidateQueries({ queryKey: ["epic", { id }] });
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
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

export function useDeleteEpic() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteEpic(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["epics"] });
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
