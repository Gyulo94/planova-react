import { create } from "zustand";

interface EditUserProfileDialogState {
  userId: string;
  isOpen: boolean;
  onOpen: (userId: string) => void;
  onClose: () => void;
}

export const useEditUserProfileDialogStore = create<EditUserProfileDialogState>(
  (set) => ({
    userId: "",
    isOpen: false,
    onOpen: (userId: string) => set({ userId, isOpen: true }),
    onClose: () => set({ userId: "", isOpen: false }),
  }),
);
