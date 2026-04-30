import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { useResetPassword, useVerifyMail } from "@/lib/query";
// import { ResetPasswordFormSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod/v3";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "react-router-dom";
import { ResetPasswordFormSchema } from "../schema";
import { useEffect } from "react";
import { useResetPassword } from "../query";

export function ResetPasswordForm({
  token,
  email,
}: {
  token: string | undefined;
  email: string;
}) {
  useEffect(() => {
    form.setValue("token", token || "");
    form.setValue("email", email);
  }, [token, email]);

  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      email: "",
      token: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { mutate: resetPasswordMutate, isPending } = useResetPassword();

  function onSubmit(values: z.infer<typeof ResetPasswordFormSchema>) {
    resetPasswordMutate(values);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="py-6">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">비밀번호 찾기</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>새로운 비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="새로운 비밀번호"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>새로운 비밀번호 확인</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="새로운 비밀번호 확인"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isPending}>비밀번호 재설정</Button>
              <div className="text-sm text-center text-muted-foreground">
                이미 계정이 있나요?{" "}
                <Link
                  to={"/login"}
                  className="text-foreground link hover:underline underline-offset-2"
                >
                  로그인
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
