import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod/v3";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoginFormSchema } from "../schema";
import { useLogin } from "../query";
import SocialLogin from "./social-login";

export default function LoginForm() {
  const { mutate: login } = useLogin();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    login(values);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="py-6">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">로그인</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-6"
              >
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이메일</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="이메일" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel>비밀번호</FormLabel>
                          <Link
                            to="/reset-password"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                          >
                            비밀번호 찾기
                          </Link>
                        </div>

                        <FormControl>
                          <Input
                            placeholder="비밀번호"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button>로그인</Button>
              </form>
            </Form>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-card px-2 text-muted-foreground">
                Or
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SocialLogin provider="kakao" />
              <SocialLogin provider="google" />
            </div>
            <div className="text-sm text-center text-muted-foreground">
              계정이 없나요?{" "}
              <Link
                to={"/register"}
                className="text-foreground link hover:underline underline-offset-2"
              >
                회원가입
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
