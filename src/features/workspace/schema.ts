import z from "zod/v3";

export const WorkspaceFormSchema = z.object({
  name: z.string().min(1, "워크스페이스 이름을 입력해주세요.").trim(),
  image: z.string().optional(),
});
