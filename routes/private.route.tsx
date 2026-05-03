import { useSession } from "@/features/user/query";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function PrivateRoute() {
  const { data: session } = useSession();
  const navigate = useNavigate();
  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);
  return (
    <>
      <Outlet />
    </>
  );
}
