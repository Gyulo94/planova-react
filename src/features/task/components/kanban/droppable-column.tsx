import { useDroppable } from "@dnd-kit/core";
import { TaskStatusType } from "../../type";

interface DroppableColumnProps {
  status: TaskStatusType;
  children: React.ReactNode;
}

export default function DroppableColumn({
  status,
  children,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={[
        "min-h-[calc(100vh-275px)] rounded-lg transition-colors",
        isOver ? "bg-primary/5" : "bg-transparent",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
