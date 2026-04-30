import z from "zod/v3";

export const RegisterFormSchema = z
  .object({
    email: z.string().email({ message: "이메일 형식이 아닙니다." }).trim(),
    name: z
      .string()
      .min(1, {
        message: "이름을 입력하세요.",
      })
      .trim(),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8글자 이상이어야 합니다." })
      .regex(/[a-zA-Z]/, { message: "비밀번호는 알파벳이 포함되어야 합니다." })
      .regex(/[0-9]/, { message: "비밀번호는 숫자가 포함되어야 합니다." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "비밀번호는 특수문자가 포함되어야 합니다.",
      })
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "비밀번호가 일치하지 않습니다.",
        path: ["confirmPassword"],
      });
    }
  });

export const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "이메일을 입력하세요.",
    })
    .trim(),
  password: z.string().min(1, { message: "비밀번호를 입력하세요." }).trim(),
});

export const EmailFormSchema = z.object({
  email: z
    .string()
    .email("이메일 형식이 아닙니다.")
    .min(1, { message: "이메일을 입력해주세요." })
    .trim(),
});

export const ResetPasswordFormSchema = z
  .object({
    email: z.string().email({ message: "이메일 형식이 아닙니다." }).trim(),
    token: z.string().trim(),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8글자 이상이어야 합니다." })
      .regex(/[a-zA-Z]/, { message: "비밀번호는 알파벳이 포함되어야 합니다." })
      .regex(/[0-9]/, { message: "비밀번호는 숫자가 포함되어야 합니다." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "비밀번호는 특수문자가 포함되어야 합니다.",
      })
      .trim(),
    confirmPassword: z
      .string()
      .min(1, { message: "비밀번호를 재입력하세요." })
      .trim(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "비밀번호가 일치하지 않습니다.",
        path: ["confirmPassword"],
      });
    }
  });
