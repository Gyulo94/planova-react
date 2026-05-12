import InviteProjectMemberDialog from "@/features/project-member/components/invite-project-member-dialog";
import CreateProjectDialog from "@/features/project/components/create-project-dialog";
import CreateTaskDialog from "@/features/task/components/create-task-dialog";
import EditTaskDialog from "@/features/task/components/edit-task-dialog";
import WorkspaceInviteCodeDialog from "@/features/workspace-member/components/workspace-invite-code-dialog";
import CreateWorkspaceDialog from "@/features/workspace/components/create-workspace-dialog";
import ProjectActivitySidebar from "@/features/activity/components/project-activity-sidebar";
import EpicDialog from "@/features/epic/components/edit-epic-dialog";
import EditMilestoneDialog from "@/features/milestone/components/edit-milestone-dialog";
import CreateMilestoneDialog from "@/features/milestone/components/create-milestone-dialog";
import CreateEpicDialog from "@/features/epic/components/create-epic-dialog";
import EditEpicDialog from "@/features/epic/components/edit-epic-dialog";
import { EditUserProfileDialog } from "@/features/user/components/profile-edit-dialog";

export default function ModalProvider() {
  return (
    <>
      <CreateWorkspaceDialog />
      <CreateProjectDialog />
      <WorkspaceInviteCodeDialog />
      <InviteProjectMemberDialog />
      <CreateTaskDialog />
      <EditTaskDialog />
      <EpicDialog />
      <CreateMilestoneDialog />
      <EditMilestoneDialog />
      <CreateEpicDialog />
      <EditEpicDialog />
      <ProjectActivitySidebar />
      <EditUserProfileDialog />
    </>
  );
}
