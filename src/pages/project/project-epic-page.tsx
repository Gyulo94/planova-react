import { Target } from "lucide-react";
import { useParams } from "react-router-dom";
import { useFindEpics, useDeleteEpic } from "@/features/epic/query";
import {
  useOpenEpicDialogStore,
  useEditEpicDialogStore,
} from "@/features/epic/store";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { useConfirm } from "@/hooks/use-confirm";
import { Epic } from "@/features/epic/type";

import { useProjectSocket } from "@/features/project/use-project-socket";
import { useSetTitle } from "@/hooks/use-set-title";
import { EpicCard } from "@/features/epic/components/epic-card";

export default function ProjectEpicPage() {
  const { workspaceId, projectId } = useParams();
  useProjectSocket(projectId);
  const { data: epics = [], isLoading } = useFindEpics(projectId);
  const { onOpen: onOpenCreate } = useOpenEpicDialogStore();
  const { onOpen: onOpenEdit } = useEditEpicDialogStore();
  const [ConfirmDialog, confirm] = useConfirm(
    "정말로 이 에픽을 삭제하시겠습니까?",
    "삭제된 에픽은 복구할 수 없습니다.",
  );
  const { mutate: deleteEpic } = useDeleteEpic();

  useSetTitle("에픽", "큰 기능 단위와 진행 상황");

  function handleCreate() {
    if (workspaceId) {
      onOpenCreate(workspaceId, projectId);
    }
  }

  function handleEdit(id: string) {
    if (workspaceId) {
      onOpenEdit(id, workspaceId, projectId);
    }
  }

  async function handleDelete(id: string) {
    const ok = await confirm();
    if (ok) {
      deleteEpic(id);
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
            className="rounded-xl flex items-center gap-2 h-11 px-6"
          >
            <Target className="size-4" />새 에픽
          </Button>
        </div>

        {epics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-lg border-2 border-dashed border-border">
            <Target className="size-12 text-muted-foreground mb-4 opacity-20" />
            <p className="text-muted-foreground pb-4">
              등록된 에픽이 없습니다.
            </p>
            <Button variant="primary" onClick={handleCreate}>
              첫 번째 에픽을 만들어보세요.
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {epics.map((epic: Epic) => (
              <EpicCard
                key={epic.id}
                epic={epic}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
