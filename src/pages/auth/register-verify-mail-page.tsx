import { useRegisterVerifyMail } from "@/features/auth/query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NotFoundPage from "../not-found";
import { useSession } from "@/features/user/query";

export default function RegiserVerifyMailPage() {
  const { token } = useParams();
  const { mutate: verify } = useRegisterVerifyMail();
  const [isError, setIsError] = useState(false);
  const { data: session } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  useEffect(() => {
    if (token) {
      verify(token, {
        onError() {
          setIsError(true);
        },
      });
    }
  }, [token, verify]);

  console.log(isError);

  if (isError) {
    return <NotFoundPage />;
  }

  return null;
}
