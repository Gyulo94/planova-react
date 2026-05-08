import DeleteSection from "@/features/project/layout/settings/delete-section";
import EditSection from "@/features/project/layout/settings/edit-section";
import { useParams } from "react-router-dom";
import { useSetTitle } from "@/hooks/use-set-title";

export default function ProjectSettingPage() {
  const { projectId, workspaceId } = useParams();

  useSetTitle("프로젝트 설정", "프로젝트의 기본 정보와 삭제 기능을 관리합니다.");

  return (
    <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-6">
        <EditSection projectId={projectId} />
        <DeleteSection projectId={projectId} workspaceId={workspaceId} />
      </div>
    </div>
  );
}
