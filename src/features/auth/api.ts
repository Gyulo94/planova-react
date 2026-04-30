import z from "zod/v3";
import { LoginFormSchema, RegisterFormSchema } from "./schema";
import { publicApi } from "@/lib/axios";

export async function register(values: z.infer<typeof RegisterFormSchema>) {
  const { confirmPassword, ...payload } = values;
  const response = await publicApi.post("/auth/register", payload);
  return response.data;
}

export async function login(values: z.infer<typeof LoginFormSchema>) {
  const response = await publicApi.post("/auth/login", values);
  return response.data;
}

export async function registerVerifyMail(token: string | undefined) {
  const values = { token, type: "register" };
  const response = await publicApi.post("/auth/verify-email", values);
  return response.data;
}
