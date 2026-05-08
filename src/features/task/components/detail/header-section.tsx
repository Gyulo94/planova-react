import {
  ChevronLeftIcon,
  Trash2Icon,
  CheckCircle2Icon,
  PencilIcon,
  EllipsisIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteTask, useApproveTask } from "../../query";
import { useEditTaskDialogStore } from "../../store";
import { useConfirm } from "@/hooks/use-confirm";

interface HeaderSectionProps {
  workspaceId?: string;
  projectId?: string;
  taskId: string;
  title: string;
  taskNumber: number;
  status: string;
  isAdmin: boolean;
  saveStatus: "idle" | "saving" | "saved";
}

export default function HeaderSection({
  workspaceId,
  projectId,
  taskId,
  title,
  taskNumber,
  status,
  isAdmin,
  saveStatus,
}: HeaderSectionProps) {
  const navigate = useNavigate();
  const { mutate: deleteTask } = useDeleteTask();
  const { mutate: approveTask } = useApproveTask();
  const { onOpen: onOpenEdit } = useEditTaskDialogStore();
  const [ConfirmDialog, confirm] = useConfirm(
    "정말로 이 작업을 삭제하시겠습니까?",
    "삭제된 작업은 복구할 수 없습니다.",
  );

  function handleEdit(id: string, status: string) {
    onOpenEdit(id, workspaceId, projectId, status);
  }

  async function handleDelete(id?: string) {
    const ok = await confirm();
    if (ok) {
      deleteTask(id);
    }
  }

  return (
    <>
      <ConfirmDialog />
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <button
            onClick={() =>
              navigate(`/workspaces/${workspaceId}/projects/${projectId}/tasks`)
            }
            className="flex items-center gap-1 hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted/50"
          >
            <ChevronLeftIcon className="size-4" />
            <span>작업</span>
          </button>
          <span>/</span>
          <span className="text-foreground/60">#{taskNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          {saveStatus === "saving" && (
            <span className="text-xs text-muted-foreground">작성중...</span>
          )}
          {saveStatus === "saved" && (
            <span className="text-xs text-emerald-600">저장됨</span>
          )}
          {status === "REVIEW" && isAdmin && (
            <Button
              variant="primary"
              size="sm"
              className="h-8 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => approveTask(taskId)}
            >
              <CheckCircle2Icon className="size-4" />
              승인하기
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => event.stopPropagation()}
              >
                <EllipsisIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onCloseAutoFocus={(event) => event.preventDefault()}
            >
              <DropdownMenuItem onSelect={() => handleEdit(taskId, status)}>
                <PencilIcon className="size-4" />
                수정
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => handleDelete(taskId)}
              >
                <Trash2Icon className="size-4" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
