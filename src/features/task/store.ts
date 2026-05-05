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
