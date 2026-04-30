import z from "zod/v3";
import {
  LoginFormSchema,
  RegisterFormSchema,
  ResetPasswordFormSchema,
} from "./schema";
import api, { publicApi } from "@/lib/axios";
import { SERVER_URL } from "@/lib/constants";

export async function register(values: z.infer<typeof RegisterFormSchema>) {
  const { confirmPassword, ...payload } = values;
  const response = await publicApi.post("/auth/register", payload);
  return response.data;
}

export async function login(values: z.infer<typeof LoginFormSchema>) {
  const response = await api.post("/auth/login", values);
  return response.data;
}

export async function socialLogin(provider: string) {
  window.location.href = `${SERVER_URL}/auth/${provider}`;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function registerVerifyMail(token: string | undefined) {
  const values = { token, type: "register" };
  const response = await publicApi.post("/auth/verify-email", values);
  return response.data;
}

export async function sendResetPasswordMail(email: string) {
  const values = { email, type: "reset" };
  const response = await publicApi.post("/auth/send-email", values);
  return response.data;
}

export async function resetPasswordVerifyMail(token: string | undefined) {
  const values = { token, type: "reset" };
  const response = await publicApi.post("/auth/verify-email", values);
  return response.data.body;
}

export async function resetPassword(
  values: z.infer<typeof ResetPasswordFormSchema>,
) {
  const { confirmPassword, ...payload } = values;
  console.log(payload);

  const response = await publicApi.put("/auth/reset-password", payload);
  return response.data;
}
