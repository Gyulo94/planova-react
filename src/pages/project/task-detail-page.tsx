import { useState } from "react";
import { useParams } from "react-router-dom";
import { updateTaskDescription } from "@/features/task/api";
import { useFindTask } from "@/features/task/query";
import { useFindProjectMembers } from "@/features/project-member/query";
import { useFindWorkspaceById } from "@/features/workspace/query";
import { useSession } from "@/features/user/query";
import {
  CommentsSection,
  HeaderSection,
  PropertiesSection,
  SubtasksSection,
  ActivitySection,
} from "@/features/task/components/detail";
import { MdEditor } from "@/components/shared/md-editor";
import Loader from "@/components/ui/loader";
import { DEFAULT_AVATAR } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { useSetTitle } from "@/hooks/use-set-title";
import { useProjectSocket } from "@/features/project/use-project-socket";

export default function TaskDetailPage() {
  const { workspaceId, projectId, taskId } = useParams();
  useProjectSocket(projectId);
  const [commentsOpen, setCommentsOpen] = useState(true);
  const [activitiesOpen, setActivitiesOpen] = useState(true);
  const [descriptionSaveStatus, setDescriptionSaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");

  const { data: task, isLoading, isError } = useFindTask(taskId);
  const { data: session } = useSession();
  const { data: projectMembers = [] } = useFindProjectMembers(projectId);
  const { data: workspace } = useFindWorkspaceById(workspaceId);

  useSetTitle(task ? `작업 ${task.title}` : "작업 상세");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground text-sm">
        오류가 발생하여 작업을 불러올 수 없습니다.
      </div>
    );
  }

  const isAssignee = task.assigneeId === session?.id;
  const myMembership = projectMembers.find((m) => m.userId === session?.id);
  const canEdit =
    myMembership?.role === "OWNER" ||
    myMembership?.role === "ADMIN" ||
    (myMembership?.role === "MEMBER" && isAssignee);

  async function HandleOnSave(description: string, tempImageUrls: string[]) {
    if (!taskId) return;
    await updateTaskDescription(description, tempImageUrls, taskId);
  }

  return (
    <div className="w-full mt-10 max-w-5xl mx-auto flex flex-col gap-0 bg-card rounded-2xl shadow-xl shadow-foreground/5 border border-border/50 overflow-hidden mb-12">
      <HeaderSection
        workspaceId={workspaceId}
        projectId={projectId}
        taskId={task.id}
        taskNumber={task.taskNumber}
        status={task.status}
        isAdmin={
          session?.id === workspace?.ownerId ||
          myMembership?.role === "OWNER" ||
          myMembership?.role === "ADMIN"
        }
        saveStatus={descriptionSaveStatus}
      />

      <div className="w-full px-6 pt-12 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight mb-3">
          {task.title}
        </h1>

        <PropertiesSection task={task} />

        <hr className="border-border/50 mb-8" />

        <div className="mb-10">
          <MdEditor
            initialContent={task.description}
            editable={canEdit}
            onSaveStatusChange={setDescriptionSaveStatus}
            onSave={HandleOnSave}
          />
        </div>

        <SubtasksSection
          taskId={task.id}
          editable={canEdit}
          initialSubtasks={task.subtask ?? []}
        />

        <CommentsSection
          taskId={task.id}
          open={commentsOpen}
          onToggle={() => setCommentsOpen((v) => !v)}
          currentUserImage={session?.image ?? DEFAULT_AVATAR}
          currentUserName={session?.name ?? "Unknown User"}
        />

        <Separator className=" my-6" />

        <ActivitySection
          open={activitiesOpen}
          onToggle={() => setActivitiesOpen((v) => !v)}
        />
      </div>
    </div>
  );
}
