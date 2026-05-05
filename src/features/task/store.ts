import { create } from "zustand";
import { TaskStatusType } from "./type";

interface TaskDialogState {
  isOpen: boolean;
  workspaceId?: string;
  projectId?: string;
  initialStatus?: TaskStatusType;
  onOpen: (
    workspaceId?: string,
    projectId?: string,
    initialStatus?: TaskStatusType,
  ) => void;
  onClose: () => void;
}

export const useOpenTaskDialogStore = create<TaskDialogState>((set) => ({
  isOpen: false,
  workspaceId: "",
  projectId: "",
  initialStatus: "TODO",
  onOpen: (workspaceId, projectId, initialStatus) =>
    set({
      isOpen: true,
      workspaceId,
      projectId,
      initialStatus: initialStatus ?? "TODO",
    }),
  onClose: () =>
    set({
      isOpen: false,
      workspaceId: "",
      projectId: "",
      initialStatus: "TODO",
    }),
}));

export interface KanbanFilterState {
  search: string;
  assigneeIds: string[];
  priorities: string[];
  labelIds: string[];

  setSearch: (search: string) => void;
  setAssigneeIds: (ids: string[]) => void;
  setPriorities: (priorities: string[]) => void;
  setLabelIds: (ids: string[]) => void;
  toggleAssigneeId: (id: string) => void;
  togglePriority: (priority: string) => void;
  toggleLabelId: (id: string) => void;
  reset: () => void;
}

const initialState = {
  search: "",
  assigneeIds: [],
  priorities: [],
  labelIds: [],
};

export const useKanbanFilterStore = create<KanbanFilterState>((set) => ({
  ...initialState,

  setSearch: (search) => set({ search }),
  setAssigneeIds: (ids) => set({ assigneeIds: ids }),
  setPriorities: (priorities) => set({ priorities }),
  setLabelIds: (ids) => set({ labelIds: ids }),

  toggleAssigneeId: (id) =>
    set((state) => ({
      assigneeIds: state.assigneeIds.includes(id)
        ? state.assigneeIds.filter((aid) => aid !== id)
        : [...state.assigneeIds, id],
    })),

  togglePriority: (priority) =>
    set((state) => ({
      priorities: state.priorities.includes(priority)
        ? state.priorities.filter((p) => p !== priority)
        : [...state.priorities, priority],
    })),

  toggleLabelId: (id) =>
    set((state) => ({
      labelIds: state.labelIds.includes(id)
        ? state.labelIds.filter((lid) => lid !== id)
        : [...state.labelIds, id],
    })),

  reset: () => set(initialState),
}));
