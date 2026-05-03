import CreateProjectDialog from "@/features/project/components/create-project-dialog";
import CreateWorkspaceDialog from "@/features/workspace/components/create-workspace-dialog";

export default function ModalProvider() {
  return (
    <>
      <CreateWorkspaceDialog />
      <CreateProjectDialog />
    </>
  );
}
