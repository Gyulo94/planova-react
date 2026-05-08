import { create } from "zustand";

interface ActivitySidebarState {
  isOpen: boolean;
  projectId?: string;
  onOpen: (projectId?: string) => void;
  onClose: () => void;
}

export const useActivitySidebarStore = create<ActivitySidebarState>((set) => ({
  isOpen: false,
  projectId: undefined,
  onOpen: (projectId) => set({ isOpen: true, projectId }),
  onClose: () => set({ isOpen: false, projectId: undefined }),
}));
