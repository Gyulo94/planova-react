import DeleteSection from "@/features/project/layout/settings/delete-section";
import EditSection from "@/features/project/layout/settings/edit-section";
import { useParams } from "react-router-dom";

export default function ProjectSettingPage() {
  const { projectId } = useParams();
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-4 px-4">
      <EditSection projectId={projectId} />
      <DeleteSection projectId={projectId} />
    </div>
  );
}
