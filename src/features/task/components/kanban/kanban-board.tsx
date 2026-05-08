import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task, TaskStatusType } from "../../type";
import {
  SortableTask,
  KanbanCard,
  DroppableColumn,
  KanbanColumnHeader,
} from ".";
import { TaskStatus } from "../../enum";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditTaskDialogStore, useOpenTaskDialogStore } from "../../store";
import { useParams } from "react-router-dom";
import { useKanbanDnd } from "../../hook";
import { useApproveTask, useDeleteTask } from "../../query";
import { useSession } from "@/features/user/query";
import { useFindProjectMembers } from "@/features/project-member/query";
import { useFindWorkspaceById } from "@/features/workspace/query";
import { useConfirm } from "@/hooks/use-confirm";

interface KanbanBoardProps {
  data?: Task[];
  onChange?: (
    updates: {
      id: string;
      status: TaskStatusType;
      order: number;
    }[],
  ) => void;
}

export default function KanbanBoard({ data = [], onChange }: KanbanBoardProps) {
  const { workspaceId, projectId } = useParams();
  const { onOpen: onOpenCreate } = useOpenTaskDialogStore();
  const { onOpen: onOpenEdit } = useEditTaskDialogStore();
  const { data: session } = useSession();
  const { data: members = [] } = useFindProjectMembers(projectId);
  const { data: workspace } = useFindWorkspaceById(workspaceId);
  const { mutate: deleteTask } = useDeleteTask();
  const { mutate: approveTask } = useApproveTask();
  const [ConfirmDialog, confirm] = useConfirm(
    "정말로 이 작업을 삭제하시겠습니까?",
    "삭제된 작업은 복구할 수 없습니다.",
  );

  const myRole = members.find((m) => m.userId === session?.id)?.role;
  const isAdmin =
    session?.id === workspace?.ownerId ||
    myRole === "ADMIN" ||
    myRole === "OWNER";

  function handleCreate(status: TaskStatusType) {
    if (workspaceId && projectId) {
      onOpenCreate(workspaceId, projectId, status);
    }
  }

  function handleEdit(task: Task) {
    onOpenEdit(task.id, workspaceId, projectId, task.status);
  }

  async function handleDelete(id?: string) {
    const ok = await confirm();
    if (ok) {
      deleteTask(id);
    }
  }

  function handleApprove(id?: string) {
    approveTask(id);
  }

  const {
    tasks,
    activeTask,
    sensors,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDragCancel,
  } = useKanbanDnd({ data, onChange });

  return (
    <>
      <ConfirmDialog />
      <div className="flex-1 w-full">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
        >
          <div className="flex gap-4">
            {Object.values(TaskStatus).map((status) => (
              <div
                key={status}
                className="flex-1 min-w-[280px] bg-muted/60 dark:bg-muted/40 rounded-xl "
              >
                <KanbanColumnHeader
                  status={status}
                  taskCount={tasks[status]?.length || 0}
                  addTaskDisabled={status === TaskStatus.DONE}
                  onAddTask={() => handleCreate(status)}
                />

                <SortableContext
                  items={tasks[status]?.map((t) => t.id) || []}
                  strategy={verticalListSortingStrategy}
                >
                  <DroppableColumn status={status}>
                    <ScrollArea className="h-[calc(100vh-275px)] max-h-[calc(100vh-275px)]">
                      <div className="p-3 space-y-1">
                        {tasks[status]?.map((task) => (
                          <SortableTask
                            key={task.id}
                            task={task}
                            isAdmin={isAdmin}
                            onEdit={() => handleEdit(task)}
                            onDelete={() => handleDelete(task.id)}
                            onApprove={() => handleApprove(task.id)}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </DroppableColumn>
                </SortableContext>
              </div>
            ))}
          </div>
          <DragOverlay>
            {activeTask ? (
              <div className="w-[280px] rotate-1 h-full opacity-95 shadow-2xl">
                <KanbanCard task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
}
