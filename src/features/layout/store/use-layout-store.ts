import { create } from "zustand";

interface LayoutState {
  title: string;
  description?: string;
  setTitle: (title: string, description?: string) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  title: "",
  description: "",
  setTitle: (title, description) => set({ title, description }),
}));
