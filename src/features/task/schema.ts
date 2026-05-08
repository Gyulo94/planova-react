import z from "zod/v3";

export const StatusTypes = z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]);
export const PriorityTypes = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const TaskFormSchema = z.object({
  title: z.string().min(1, "작업 제목을 입력해주세요."),
  labelId: z.string().optional(),
  labelName: z.string().optional(),
  status: StatusTypes,
  priority: PriorityTypes,
  startDate: z.date().optional(),
  dueDate: z.date().optional(),
  assigneeId: z.string().min(1, "담당자를 선택해주세요."),
  projectId: z.string().min(1, "프로젝트를 선택해주세요."),
  epicId: z.string().nullable().optional(),
  milestoneId: z.string().nullable().optional(),
});
