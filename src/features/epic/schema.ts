import z from "zod/v3";

export const EpicFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  description: z.string().optional(),
  startDate: z.date().min(new Date(), "시작 날짜는 오늘 이후로 설정해주세요."),
  dueDate: z.date().min(new Date(), "마감 날짜는 오늘 이후로 설정해주세요."),
  workspaceId: z.string().uuid(),
  projectId: z.string().uuid(),
  milestoneId: z.string().nullable().optional(),
});
