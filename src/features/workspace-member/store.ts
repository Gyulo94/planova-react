import { create } from "zustand";

interface WorkspaceInviteCodeDialogStore {
  workspaceId: string;
  isOpen: boolean;
  onOpen: (workspaceId: string) => void;
  onClose: () => void;
}

export const useOpenWorkspaceInviteCodeDialogStore =
  create<WorkspaceInviteCodeDialogStore>((set) => ({
    workspaceId: "",
    isOpen: false,
    onOpen: (workspaceId: string) => set({ isOpen: true, workspaceId }),
    onClose: () => set({ isOpen: false, workspaceId: "" }),
  }));
