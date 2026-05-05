import InviteProjectMemberDialog from "@/features/project-member/components/invite-project-member-dialog";
import CreateProjectDialog from "@/features/project/components/create-project-dialog";
import CreateTaskDialog from "@/features/task/components/create-task-dialog";
import WorkspaceInviteCodeDialog from "@/features/workspace-member/components/workspace-invite-code-dialog";
import CreateWorkspaceDialog from "@/features/workspace/components/create-workspace-dialog";

export default function ModalProvider() {
  return (
    <>
      <CreateWorkspaceDialog />
      <CreateProjectDialog />
      <WorkspaceInviteCodeDialog />
      <InviteProjectMemberDialog />
      <CreateTaskDialog />
    </>
  );
}
