import { Milestone as MilestoneIcon, Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import {
  useFindMilestones,
  useDeleteMilestone,
} from "@/features/milestone/query";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { useConfirm } from "@/hooks/use-confirm";
import {
  useEditMilestoneDialogStore,
  useOpenMilestoneDialogStore,
} from "@/features/milestone/store";

import { useProjectSocket } from "@/features/project/use-project-socket";
import { useSetTitle } from "@/hooks/use-set-title";
import MilestoneCard from "@/features/milestone/components/milestone-card";

export default function ProjectMilestonePage() {
  const { workspaceId, projectId } = useParams();
  useProjectSocket(projectId);
  const { data: milestones = [], isLoading } = useFindMilestones(projectId);
  const { onOpen: onOpenCreate } = useOpenMilestoneDialogStore();
  const { onOpen: onOpenEdit } = useEditMilestoneDialogStore();
  const { mutate: deleteMilestone } = useDeleteMilestone();
  const [ConfirmDialog, confirm] = useConfirm(
    "정말로 이 마일스톤을 삭제하시겠습니까?",
    "삭제된 마일스톤은 복구할 수 없습니다.",
  );

  useSetTitle("마일스톤", "프로젝트의 주요 이정표 및 진행 상황");

  function handleCreate() {
    if (workspaceId) {
      onOpenCreate(workspaceId, projectId);
    }
  }

  function handleEdit(id: string) {
    if (workspaceId) {
      onOpenEdit(id);
    }
  }

  async function handleDelete(id: string) {
    const ok = await confirm();
    if (ok) {
      deleteMilestone(id);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-end">
          <Button
            onClick={handleCreate}
            className="rounded-xl flex items-center gap-2 px-6 h-11"
          >
            <Plus className="size-4" />새 마일스톤
          </Button>
        </div>

        {milestones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-lg border-2 border-dashed border-border">
            <MilestoneIcon className="size-12 text-muted-foreground mb-4 opacity-20" />
            <p className="text-muted-foreground pb-4">
              등록된 마일스톤이 없습니다.
            </p>
            <Button variant="primary" onClick={handleCreate}>
              첫 번째 마일스톤을 만들어보세요.
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {milestones.map((milestone) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
