import { useSocialCallback } from "@/features/auth/hooks/use-social-callback";
import { useFindWorkspaces } from "@/features/workspace/query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const { data: workspace, isLoading } = useFindWorkspaces();
  const navigate = useNavigate();

  useSocialCallback();

  useEffect(() => {
    if (isLoading) return;
    if (workspace && workspace.length > 0) {
      navigate(`/workspaces/${workspace[0].id}`);
    } else {
      navigate("/workspaces/new");
    }
  }, [workspace, isLoading, navigate]);

  return null;
}
