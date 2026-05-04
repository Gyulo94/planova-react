import JoinWorkspaceForm from "@/features/workspace-member/components/join-workspace-form";
import { useParams } from "react-router-dom";

export default function JoinWorkspacePage() {
  const { workspaceId, inviteCode } = useParams();

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-accent">
      <JoinWorkspaceForm workspaceId={workspaceId} inviteCode={inviteCode} />
    </div>
  );
}
