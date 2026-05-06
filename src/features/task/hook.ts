import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Task, TaskStatusType } from "./type";
import {
  buildPayload,
  buildTasksByStatus,
  canMoveToStatus,
  findTaskStatus,
  getDestinationStatus,
  moveTask,
  type KanbanTaskGroups,
} from "./utils";

interface UseKanbanDndOptions {
  data: Task[];
  onChange?: (
    updates: { id: string; status: TaskStatusType; order: number }[],
  ) => void;
}

export function useKanbanDnd({ data, onChange }: UseKanbanDndOptions) {
  const groupedTasks = useMemo(() => buildTasksByStatus(data), [data]);
  const [dragTasks, setDragTasks] = useState<KanbanTaskGroups | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const dragTasksRef = useRef<KanbanTaskGroups | null>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!isDraggingRef.current) {
      setDragTasks(null);
    }
  }, [groupedTasks]);

  const tasks = dragTasks ?? groupedTasks;
  const activeTask = useMemo(
    () => data.find((task) => task.id === activeTaskId) ?? null,
    [activeTaskId, data],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const onDragStart = useCallback(
    (event: DragStartEvent) => {
      isDraggingRef.current = true;
      setActiveTaskId(String(event.active.id));
      setDragTasks(groupedTasks);
      dragTasksRef.current = groupedTasks;
    },
    [groupedTasks],
  );

  const onDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    setDragTasks((current) => {
      if (!current) return current;

      const sourceStatus = findTaskStatus(current, activeId);
      if (!sourceStatus) return current;

      const destStatus = getDestinationStatus(current, overId, sourceStatus);
      if (!canMoveToStatus(sourceStatus, destStatus)) return current;

      const isSameContainer = sourceStatus === destStatus;
      const activeIndex = current[sourceStatus].findIndex(
        (task) => task.id === activeId,
      );
      const overIndex = current[destStatus].findIndex(
        (task) => task.id === overId,
      );

      if (isSameContainer && activeIndex === overIndex) return current;

      if (isSameContainer && activeIndex !== -1 && overIndex !== -1) {
        const nextTasks = {
          ...current,
          [sourceStatus]: arrayMove(
            current[sourceStatus],
            activeIndex,
            overIndex,
          ),
        };
        dragTasksRef.current = nextTasks;
        return nextTasks;
      }

      const nextTasks = moveTask(current, activeId, overId);
      dragTasksRef.current = nextTasks;
      return nextTasks;
    });
  }, []);

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { over } = event;
      setActiveTaskId(null);

      if (!over) {
        setDragTasks(null);
        dragTasksRef.current = null;
        return;
      }

      const finalTasks = dragTasksRef.current ?? groupedTasks;
      const payload = buildPayload(finalTasks, groupedTasks);

      isDraggingRef.current = false;
      dragTasksRef.current = null;

      if (payload.length === 0) {
        setDragTasks(null);
        return;
      }

      setDragTasks(finalTasks);
      onChange?.(payload);
    },
    [groupedTasks, onChange],
  );

  const onDragCancel = useCallback(() => {
    isDraggingRef.current = false;
    setActiveTaskId(null);
    setDragTasks(null);
    dragTasksRef.current = null;
  }, []);

  return {
    tasks,
    activeTask,
    sensors,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDragCancel,
  };
}
