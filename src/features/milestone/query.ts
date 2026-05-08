import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMilestone,
  deleteMilestone,
  findMilestoneById,
  findMilestonesByProjectId,
  updateMilestone,
} from "./api";
import { toast } from "sonner";
import z from "zod/v3";
import { MilestoneFormSchema } from "./schema";
import { Milestone } from "./type";

export function useFindMilestones(projectId?: string) {
  return useQuery({
    queryKey: ["milestones", { projectId }],
    queryFn: () => findMilestonesByProjectId(projectId),
    enabled: !!projectId,
  });
}

export function useFindMilestone(id?: string) {
  return useQuery<Milestone>({
    queryKey: ["milestone", { id }],
    queryFn: () => findMilestoneById(id),
    enabled: !!id,
  });
}

export function useCreateMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: z.infer<typeof MilestoneFormSchema>) =>
      createMilestone(values),
    onSuccess: (data) => {
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
}

export function useUpdateMilestone(id?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: z.infer<typeof MilestoneFormSchema>) =>
      updateMilestone(values, id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
      queryClient.invalidateQueries({ queryKey: ["milestone", { id }] });
      toast.success(data.message);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
}

export function useDeleteMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMilestone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
      toast.success("마일스톤이 삭제되었습니다.");
    },
    onError: () => {
      toast.error("마일스톤 삭제에 실패했습니다.");
    },
  });
}
