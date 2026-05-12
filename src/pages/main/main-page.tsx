import { useSocialCallback } from "@/features/auth/hooks/use-social-callback";
import { useFindWorkspaces } from "@/features/workspace/query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotFoundPage from "../not-found";

export default function MainPage() {
  const { data: workspace, isLoading, isError } = useFindWorkspaces();
  const navigate = useNavigate();

  useSocialCallback();

  useEffect(() => {
    if (isLoading) return;
    if (workspace && workspace.length === 0) {
      navigate("/workspaces/new");
    } else if (workspace && workspace.length > 0) {
      navigate(`/workspaces/${workspace[0].id}`);
    }
  }, [workspace, isLoading, navigate]);

  if (isError) {
    return <NotFoundPage />;
  }

  return null;
}
