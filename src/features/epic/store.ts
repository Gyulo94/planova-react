import { create } from "zustand";

interface OpenEpicDialogStore {
  isOpen: boolean;
  projectId?: string;
  workspaceId?: string;
  onOpen: (workspaceId?: string, projectId?: string) => void;
  onClose: () => void;
}

export const useOpenEpicDialogStore = create<OpenEpicDialogStore>((set) => ({
  isOpen: false,
  projectId: undefined,
  workspaceId: undefined,

  onOpen: (workspaceId, projectId) =>
    set({ isOpen: true, workspaceId, projectId }),
  onClose: () =>
    set({
      isOpen: false,
      workspaceId: undefined,
      projectId: undefined,
    }),
}));

interface EditEpicDialogStore {
  isOpen: boolean;
  id?: string;
  onOpen: (id?: string, workspaceId?: string, projectId?: string) => void;
  onClose: () => void;
}

export const useEditEpicDialogStore = create<EditEpicDialogStore>((set) => ({
  isOpen: false,
  id: undefined,
  projectId: undefined,
  workspaceId: undefined,

  onOpen: (id) => set({ isOpen: true, id }),
  onClose: () =>
    set({
      isOpen: false,
      id: undefined,
    }),
}));
