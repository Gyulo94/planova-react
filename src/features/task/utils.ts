import { TaskStatus } from "./enum";
import { Task, TaskStatusType } from "./type";

export type KanbanTaskGroups = Record<TaskStatusType, Task[]>;

/**
 * Task를 상태별로 그룹화하고, 각 그룹 내에서 order 순으로 정렬
 */
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

/**
 * 특정 taskId가 어느 상태에 있는지 찾음
 */
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

/**
 * 드래그 앤 드롭 시 도착할 상태를 결정
 */
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

/**
 * 해당 상태로 이동 가능한지 체크
 */
export function canMoveToStatus(
  sourceStatus: TaskStatusType,
  destinationStatus: TaskStatusType,
): boolean {
  return (
    sourceStatus === destinationStatus || destinationStatus !== TaskStatus.DONE
  );
}

/**
 * Task를 이동한 새로운 KanbanTaskGroups 반환 (불변성 유지)
 */
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

/**
 * 변경된 Task만 payload로 추출 (서버 업데이트용)
 */
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
