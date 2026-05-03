import { useRegisterVerifyMail } from "@/features/auth/query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFoundPage from "../not-found";

export default function RegiserVerifyMailPage() {
  const { token } = useParams();
  const { mutate: verify } = useRegisterVerifyMail();
  const [isError, setIsError] = useState(false);

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
