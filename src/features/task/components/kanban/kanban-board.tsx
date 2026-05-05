import {
  DndContext,
  DragOverlay,
  DragOverEvent,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Task, TaskStatusType } from "../../type";
import KanbanColumnHeader from "./kanban-column-header";
import { SortableTask } from "./sortable-task";
import KanbanCard from "./kanban-card";
import { TaskStatus } from "../../enum";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOpenTaskDialogStore } from "../../store";
import { useParams } from "react-router-dom";
import {
  buildPayload,
  buildTasksByStatus,
  canMoveToStatus,
  findTaskStatus,
  getDestinationStatus,
  moveTask,
  type KanbanTaskGroups,
} from "../../utils";

interface Props {
  data?: Task[];
  onChange?: (
    updates: {
      id: string;
      status: TaskStatusType;
      order: number;
    }[],
  ) => void;
}

function DroppableColumn({
  status,
  children,
}: {
  status: TaskStatusType;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={[
        "mt-4 min-h-[calc(100vh-275px)] rounded-lg transition-colors",
        isOver ? "bg-primary/5" : "bg-transparent",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default function KanbanBoard({ data = [], onChange }: Props) {
  const { workspaceId, projectId } = useParams();
  const { onOpen } = useOpenTaskDialogStore();
  const groupedTasks = useMemo(() => buildTasksByStatus(data), [data]);
  const [tasks, setTasks] = useState<KanbanTaskGroups>(groupedTasks);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const tasksRef = useRef(groupedTasks);

  useEffect(() => {
    tasksRef.current = groupedTasks;
    setTasks(groupedTasks);
  }, [groupedTasks]);

  const activeTask = useMemo(
    () => data.find((task) => task.id === activeTaskId) ?? null,
    [activeTaskId, data],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const onDragStart = useCallback((event: DragStartEvent) => {
    setActiveTaskId(String(event.active.id));
  }, []);

  const onDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) {
      return;
    }

    setTasks((current) => {
      const sourceStatus = findTaskStatus(current, activeId);

      if (!sourceStatus) {
        return current;
      }

      const destStatus = getDestinationStatus(current, overId, sourceStatus);

      if (!canMoveToStatus(sourceStatus, destStatus)) {
        return current;
      }

      const isSameContainer = sourceStatus === destStatus;
      const activeIndex = current[sourceStatus].findIndex(
        (task) => task.id === activeId,
      );
      const overIndex = current[destStatus].findIndex(
        (task) => task.id === overId,
      );

      if (isSameContainer && activeIndex === overIndex) {
        return current;
      }

      if (isSameContainer && activeIndex !== -1 && overIndex !== -1) {
        const nextTasks = {
          ...current,
          [sourceStatus]: arrayMove(
            current[sourceStatus],
            activeIndex,
            overIndex,
          ),
        };

        tasksRef.current = nextTasks;
        return nextTasks;
      }

      const nextTasks = moveTask(current, activeId, overId);
      tasksRef.current = nextTasks;
      return nextTasks;
    });
  }, []);

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { over } = event;
      setActiveTaskId(null);

      if (!over) return;

      const finalTasks = tasksRef.current;
      const payload = buildPayload(finalTasks, groupedTasks);

      if (payload.length === 0) {
        return;
      }

      onChange?.(payload);
    },
    [groupedTasks, onChange],
  );

  const onDragCancel = useCallback(() => {
    setActiveTaskId(null);
    tasksRef.current = groupedTasks;
    setTasks(groupedTasks);
  }, [groupedTasks]);

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
