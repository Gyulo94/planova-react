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
import { useOpenTaskDialogStore } from "../../store";
import { useParams } from "react-router-dom";
import { useKanbanDnd } from "../../hook";

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
  const { onOpen } = useOpenTaskDialogStore();
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
    <div className="flex-1 w-full bg-background">
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
                onAddTask={() => onOpen(workspaceId, projectId, status)}
              />

              <SortableContext
                items={tasks[status]?.map((t) => t.id) || []}
                strategy={verticalListSortingStrategy}
              >
                <DroppableColumn status={status}>
                  <ScrollArea className="h-[calc(100vh-275px)] max-h-[calc(100vh-275px)] p-3">
                    {tasks[status]?.map((task) => (
                      <SortableTask key={task.id} task={task} />
                    ))}
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
  );
}
