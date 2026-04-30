import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { useResetPasswordVerifyMail } from "@/features/auth/query";
import { useSession } from "@/features/user/query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NotFoundPage from "../not-found";

export default function ResetPasswordPage() {
  const { data: session } = useSession();
  const { token } = useParams();
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const { mutate: verify } = useResetPasswordVerifyMail();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  useEffect(() => {
    if (token) {
      verify(token, {
        onSuccess(data) {
          setEmail(data.email);
          console.log(email);
        },
        onError() {
          setIsError(true);
        },
      });
    }
  }, [token, verify]);

  if (isError) {
    return <NotFoundPage />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 md:px-10">
      <div className="flex w-full justify-center max-w-sm flex-col gap-6">
        <ResetPasswordForm token={token} email={email} />
      </div>
    </main>
  );
}
