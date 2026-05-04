import { create } from "zustand";

interface InviteProjectMemberState {
  projectId?: string;
  isOpen: boolean;
  onOpen: (projectId?: string) => void;
  onClose: () => void;
}

export const useOpenInviteProjectMemberDialogStore =
  create<InviteProjectMemberState>((set) => ({
    isOpen: false,
    projectId: "",
    onOpen: (projectId?: string) => set({ isOpen: true, projectId }),
    onClose: () => set({ isOpen: false, projectId: "" }),
  }));
