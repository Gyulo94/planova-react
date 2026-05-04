import DeleteSection from "@/features/workspace/layout/settings/delete-section";
import EditSection from "@/features/workspace/layout/settings/edit-section";
import InviteCodeSection from "@/features/workspace/layout/settings/invite-code-section";
import { useParams } from "react-router-dom";

export default function WorkspaceSettingPage() {
  const { workspaceId } = useParams();
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-4 px-4">
      <EditSection workspaceId={workspaceId} />
      <InviteCodeSection workspaceId={workspaceId} />
      <DeleteSection workspaceId={workspaceId} />
    </div>
  );
}
