import z from "zod/v3";

export const ProjectFormSchema = z.object({
  name: z.string().min(1, "프로젝트 이름을 입력해주세요.").trim(),
  image: z.string().optional(),
});
