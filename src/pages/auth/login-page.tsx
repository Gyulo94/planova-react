import { LoginForm } from "@/features/auth/components";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 md:px-10">
      <div className="flex w-full justify-center max-w-sm flex-col gap-6">
        <LoginForm />
      </div>
    </main>
  );
}
