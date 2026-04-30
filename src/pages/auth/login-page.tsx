import { LoginForm } from "@/features/auth/components";
import { useSession } from "@/features/user/query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function LoginPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: session } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "AUTH_005") {
      setSearchParams({}, { replace: true });
      setTimeout(() => {
        toast.error("이미 이메일/비밀번호로 가입된 유저입니다.");
      }, 0);
    }
  }, []);

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 md:px-10">
      <div className="flex w-full justify-center max-w-sm flex-col gap-6">
        <LoginForm />
      </div>
    </main>
  );
}
