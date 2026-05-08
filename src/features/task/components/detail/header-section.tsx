import {
  ChevronLeftIcon,
  MoreHorizontalIcon,
  Trash2Icon,
  CheckCircle2Icon,
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
import { toast } from "sonner";
import { useOpenTaskDialogStore } from "../../store";

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
  const {} = useOpenTaskDialogStore();

  function handleUpdate() {}

  const handleDelete = () => {
    if (confirm(`'${title}' 작업을 삭제하시겠습니까?`)) {
      deleteTask(taskId, {
        onSuccess: () => {
          toast.success("작업이 삭제되었습니다.");
          navigate(`/workspaces/${workspaceId}/projects/${projectId}/tasks`);
        },
      });
    }
  };

  return (
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
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground"
            >
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              variant="destructive"
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2Icon className="size-4" />
              <span>작업 삭제</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
