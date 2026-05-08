import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import KanbanCard from "./kanban-card";
import { Task } from "../../type";

interface SortableTaskProps {
  task: Task;
  isAdmin: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onApprove?: (task: Task) => void;
}

export default function SortableTask({
  task,
  isAdmin,
  onEdit,
  onDelete,
  onApprove,
}: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard 
        task={task} 
        isAdmin={isAdmin}
        onEdit={onEdit} 
        onDelete={onDelete}
        onApprove={onApprove} 
      />
    </div>
  );
}
