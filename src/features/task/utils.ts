import { TaskStatus } from "./enum";
import { Task, TaskStatusType } from "./type";

export type KanbanTaskGroups = Record<TaskStatusType, Task[]>;

export function filterTasks(
  tasks: Task[],
  filters: {
    search?: string;
    assigneeIds?: string[];
    priorities?: string[];
    labelIds?: string[];
  },
): Task[] {
  return tasks.filter((task) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matches =
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        `#${task.taskNumber}`.includes(filters.search);

      if (!matches) return false;
    }

    if (filters.assigneeIds && filters.assigneeIds.length > 0) {
      if (!task.assigneeId || !filters.assigneeIds.includes(task.assigneeId)) {
        return false;
      }
    }

    if (filters.priorities && filters.priorities.length > 0) {
      if (!filters.priorities.includes(task.priority)) return false;
    }

    if (filters.labelIds && filters.labelIds.length > 0) {
      if (!task.labelId || !filters.labelIds.includes(task.labelId)) {
        return false;
      }
    }

    return true;
  });
}

export function buildTasksByStatus(data: Task[]): KanbanTaskGroups {
  const groups = Object.fromEntries(
    Object.values(TaskStatus).map((status) => [status, [] as Task[]]),
  ) as KanbanTaskGroups;

  data.forEach((task) => {
    if (groups[task.status as TaskStatusType]) {
      groups[task.status as TaskStatusType].push(task);
    }
  });

  Object.values(groups).forEach((tasks) => {
    tasks.sort((a, b) => a.order - b.order);
  });

  return groups;
}

export function findTaskStatus(
  tasks: KanbanTaskGroups,
  taskId: string,
): TaskStatusType | null {
  return (
    (Object.keys(tasks) as TaskStatusType[]).find((status) =>
      tasks[status].some((task) => task.id === taskId),
    ) ?? null
  );
}

export function getDestinationStatus(
  tasks: KanbanTaskGroups,
  overId: string,
  fallbackStatus: TaskStatusType,
): TaskStatusType {
  if (
    (Object.values(TaskStatus) as TaskStatusType[]).includes(
      overId as TaskStatusType,
    )
  ) {
    return overId as TaskStatusType;
  }

  return findTaskStatus(tasks, overId) ?? fallbackStatus;
}

export function canMoveToStatus(
  sourceStatus: TaskStatusType,
  destinationStatus: TaskStatusType,
): boolean {
  if (sourceStatus === TaskStatus.DONE) {
    return destinationStatus === TaskStatus.DONE;
  }

  return (
    sourceStatus === destinationStatus || destinationStatus !== TaskStatus.DONE
  );
}

export function moveTask(
  tasks: KanbanTaskGroups,
  activeId: string,
  overId: string,
): KanbanTaskGroups {
  const sourceStatus = findTaskStatus(tasks, activeId);
  if (!sourceStatus) return tasks;

  const movedTask = tasks[sourceStatus].find((t) => t.id === activeId);
  if (!movedTask) return tasks;

  const destStatus = getDestinationStatus(tasks, overId, sourceStatus);

  const nextTasks = Object.fromEntries(
    (Object.keys(tasks) as TaskStatusType[]).map((status) => [
      status,
      [...tasks[status]],
    ]),
  ) as KanbanTaskGroups;

  nextTasks[sourceStatus] = nextTasks[sourceStatus].filter(
    (t) => t.id !== activeId,
  );

  const updatedTask = { ...movedTask, status: destStatus };
  const destIndex = nextTasks[destStatus].findIndex((t) => t.id === overId);

  if (overId === destStatus || destIndex === -1) {
    nextTasks[destStatus].unshift(updatedTask);
  } else {
    nextTasks[destStatus].splice(destIndex, 0, updatedTask);
  }

  return nextTasks;
}

export function buildPayload(
  current: KanbanTaskGroups,
  baseline: KanbanTaskGroups,
): Array<{ id: string; status: TaskStatusType; order: number }> {
  const payload: Array<{ id: string; status: TaskStatusType; order: number }> =
    [];

  const baselineMap = new Map(
    Object.values(baseline)
      .flat()
      .map((task) => [task.id, task]),
  );

  Object.entries(current).forEach(([statusKey, tasks]) => {
    const status = statusKey as TaskStatusType;

    tasks.forEach((task, index) => {
      const newOrder = Math.min((index + 1) * 1000, 1_000_000);
      const previous = baselineMap.get(task.id);

      if (
        !previous ||
        previous.status !== status ||
        previous.order !== newOrder
      ) {
        payload.push({ id: task.id, status, order: newOrder });
      }
    });
  });

  return payload;
}
