import { useSession } from "@/features/user/query";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const { data: session, isLoading } = useSession();

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
