import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "react-router-dom";
import { EmailFormSchema } from "@/features/auth/schema";
import { useSendResetPasswordMail } from "@/features/auth/query";

type Email = { email: string };

export default function EmailForm() {
  const { mutate: sendMail } = useSendResetPasswordMail();

  const form = useForm<Email>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: Email) {
    sendMail(data.email, {
      onSuccess() {
        form.reset();
      },
    });
  }
  return (
    <div className="flex flex-col gap-6">
      <Card className="py-6">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">이메일 인증</CardTitle>
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
                          <Input placeholder="이메일" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button>이메일 인증</Button>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
