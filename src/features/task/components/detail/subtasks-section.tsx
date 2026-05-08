import { useState, useEffect } from "react";
import { PlusIcon, Trash2Icon, Loader2Icon } from "lucide-react";
import { Subtask } from "../../type";
import {
  useCreateSubtask,
  useUpdateSubtask,
  useDeleteSubtask,
} from "../../query";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface SubtasksSectionProps {
  taskId: string;
  editable: boolean;
  initialSubtasks: Subtask[];
}

export default function SubtasksSection({
  taskId,
  editable,
  initialSubtasks,
}: SubtasksSectionProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>(initialSubtasks);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const { mutate: createSubtask, isPending: isCreating } =
    useCreateSubtask(taskId);
  const { mutate: updateSubtask } = useUpdateSubtask(taskId);
  const { mutate: deleteSubtask } = useDeleteSubtask();

  useEffect(() => {
    setSubtasks(initialSubtasks);
  }, [initialSubtasks]);

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;

    createSubtask({
      title: newSubtaskTitle.trim(),
    });
    setNewSubtaskTitle("");
    setIsAdding(false);
  };

  const handleToggleComplete = async (subtask: Subtask) => {
    try {
      updateSubtask({
        id: subtask.id,
        data: { title: subtask.title, completed: !subtask.completed },
      });
    } catch (error) {
      toast.error("상태 변경에 실패했습니다.");
    }
  };

  const handleUpdateTitle = async (id: string, newTitle: string) => {
    const original = initialSubtasks.find((s) => s.id === id);
    if (!original || original.title === newTitle) return;

    try {
      updateSubtask({
        id,
        data: { title: newTitle },
      });
      toast.success("수정되었습니다.");
    } catch (error) {
      toast.error("수정에 실패했습니다.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      deleteSubtask({ id, taskId });
      toast.success("삭제되었습니다.");
    } catch (error) {
      toast.error("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            하위 작업
            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">
              {subtasks.filter((s) => s.completed).length}/{subtasks.length}
            </span>
          </h3>
        </div>
        {editable && !isAdding && (
          <Button
            variant="ghost"
            size="sm"
            className=" text-xs gap-1 h-8 px-2"
            onClick={() => setIsAdding(true)}
          >
            <PlusIcon className="h-3.5 w-3.5" />
            추가
          </Button>
        )}
      </div>

      <div className="space-y-1">
        {subtasks.length === 0 && !isAdding && (
          <p className="text-xs text-muted-foreground py-4 text-center border border-dashed rounded-lg">
            등록된 하위 작업이 없습니다.
          </p>
        )}

        {subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className="group flex items-center gap-3 p-2 hover:bg-accent/50 rounded-md transition-colors"
          >
            <Checkbox
              checked={subtask.completed}
              onCheckedChange={() => handleToggleComplete(subtask)}
              className="mt-0.5"
            />
            <Input
              defaultValue={subtask.title}
              onBlur={(e) => handleUpdateTitle(subtask.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdateTitle(subtask.id, e.currentTarget.value);
                  e.currentTarget.blur();
                }
              }}
              className={cn(
                "h-7 text-sm border-none shadow-none focus-visible:ring-1 bg-transparent p-0 px-1",
                subtask.completed &&
                  "text-muted-foreground line-through decoration-muted-foreground/50",
              )}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              onClick={() => handleDelete(subtask.id)}
            >
              <Trash2Icon className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}

        {isAdding && (
          <div className="flex items-center gap-3 p-2 bg-accent/30 rounded-md border border-primary/20">
            <div className="size-4 rounded-[4px] border border-dashed border-muted-foreground/50 shrink-0" />
            <Input
              autoFocus
              placeholder="하위 작업 제목을 입력하세요..."
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddSubtask();
                if (e.key === "Escape") setIsAdding(false);
              }}
              className="h-7 text-sm border-none shadow-none focus-visible:ring-0 bg-transparent p-0 px-1"
            />
            <div className="flex items-center gap-1 shrink-0">
              <Button
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={handleAddSubtask}
                disabled={isCreating || !newSubtaskTitle.trim()}
              >
                {isCreating ? (
                  <Loader2Icon className="h-3 w-3 animate-spin" />
                ) : (
                  "저장"
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setIsAdding(false)}
              >
                취소
              </Button>
            </div>
          </div>
        )}
      </div>

      <Separator className="my-4 opacity-50" />
    </div>
  );
}
