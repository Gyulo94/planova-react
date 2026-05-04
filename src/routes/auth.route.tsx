import { useSession } from "@/features/user/query";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function AuthRoute() {
  const { data: session } = useSession();
  const navigate = useNavigate();
  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);
  return (
    <>
      <Outlet />
    </>
  );
}
