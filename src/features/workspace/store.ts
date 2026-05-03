import { OpenState } from "@/lib/type";
import { create } from "zustand";

export const useOpenWorkspaceDialogStore = create<OpenState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
