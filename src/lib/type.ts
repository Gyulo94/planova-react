export type OpenState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}
