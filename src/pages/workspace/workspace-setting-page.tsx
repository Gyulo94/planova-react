import DeleteSection from "@/features/workspace/layout/settings/delete-section";
import EditSection from "@/features/workspace/layout/settings/edit-section";
import InviteCodeSection from "@/features/workspace/layout/settings/invite-code-section";
import { useParams } from "react-router-dom";
import { useSetTitle } from "@/hooks/use-set-title";

export default function WorkspaceSettingPage() {
  const { workspaceId } = useParams();

  useSetTitle("워크스페이스 설정", "워크스페이스 이름, 이미지 및 일반 설정을 관리합니다.");

  return (
    <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-6">
        <EditSection workspaceId={workspaceId} />
        <InviteCodeSection workspaceId={workspaceId} />
        <DeleteSection workspaceId={workspaceId} />
      </div>
    </div>
  );
}
