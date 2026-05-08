import { create } from "zustand";

interface OpenMilestoneDialogState {
  isOpen: boolean;
  projectId?: string;
  workspaceId?: string;
  onOpen: (workspaceId: string, projectId?: string) => void;
  onClose: () => void;
}

export const useOpenMilestoneDialogStore = create<OpenMilestoneDialogState>(
  (set) => ({
    isOpen: false,
    projectId: undefined,
    workspaceId: undefined,
    onOpen: (workspaceId, projectId) =>
      set({
        isOpen: true,
        workspaceId,
        projectId,
      }),
    onClose: () =>
      set({
        isOpen: false,
        workspaceId: undefined,
        projectId: undefined,
      }),
  }),
);

interface EditMilestoneDialogState {
  isOpen: boolean;
  id?: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useEditMilestoneDialogStore = create<EditMilestoneDialogState>(
  (set) => ({
    isOpen: false,
    id: undefined,
    onOpen: (id) =>
      set({
        isOpen: true,
        id,
      }),
    onClose: () =>
      set({
        isOpen: false,
        id: undefined,
      }),
  }),
);
