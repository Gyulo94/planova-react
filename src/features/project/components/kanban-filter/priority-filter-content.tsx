import { Priority } from "@/lib/type";

interface PriorityFilterContentProps {
  selected: string[];
  onToggle: (priority: Priority) => void;
}

export default function PriorityFilterContent({
  selected,
  onToggle,
}: PriorityFilterContentProps) {
  const priorityMap: Record<Priority, string> = {
    LOW: "낮음",
    MEDIUM: "보통",
    HIGH: "높음",
    URGENT: "긴급",
  };

  return (
    <div className="space-y-1">
      {Object.values(Priority).map((priority) => (
        <button
          key={priority}
          onClick={() => onToggle(priority)}
          className={`w-full flex items-center gap-2 p-2 rounded hover:bg-accent transition-colors text-left ${
            selected.includes(priority) ? "bg-accent" : ""
          }`}
        >
          <input
            type="checkbox"
            checked={selected.includes(priority)}
            readOnly
            className="rounded"
          />
          <span className="text-sm">{priorityMap[priority]}</span>
        </button>
      ))}
    </div>
  );
}
