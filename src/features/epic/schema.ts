import z from "zod/v3";

export const EpicFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  description: z.string().optional(),
  startDate: z.date(),
  dueDate: z.date(),
  workspaceId: z.string().uuid(),
  projectId: z.string().uuid(),
  milestoneId: z.string().nullable().optional(),
});
