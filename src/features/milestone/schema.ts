import z from "zod/v3";

export const MilestoneFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  description: z.string().optional(),
  dueDate: z.date({
    required_error: "마감일을 선택해주세요.",
  }),
  workspaceId: z.string().uuid(),
  projectId: z.string().uuid(),
  completed: z.boolean().optional(),
});
