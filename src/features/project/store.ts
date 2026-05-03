import { create } from "zustand";

interface ProjectState {
  workspaceId?: string;
  isOpen: boolean;
  onOpen: (workspaceId?: string) => void;
  onClose: () => void;
}

export const useOpenProjectDialogStore = create<ProjectState>((set) => ({
  isOpen: false,
  workspaceId: "",
  onOpen: (workspaceId?: string) => set({ isOpen: true, workspaceId }),
  onClose: () => set({ isOpen: false, workspaceId: "" }),
}));
