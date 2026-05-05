import { Badge } from "@/components/ui/badge";
import { Label } from "@/features/label/type";

interface LabelFilterContentProps {
  labels: Label[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export default function LabelFilterContent({
  labels,
  selectedIds,
  onToggle,
}: LabelFilterContentProps) {
  return (
    <div className="space-y-1 max-h-80 overflow-auto">
      {labels.map((label) => (
        <button
          key={label.id}
          onClick={() => onToggle(label.id)}
          className={`w-full flex items-center gap-2 p-2 rounded hover:bg-accent transition-colors ${
            selectedIds.includes(label.id) ? "bg-accent" : ""
          }`}
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(label.id)}
            readOnly
            className="rounded"
          />
          <Badge
            style={{ backgroundColor: label.bgColor, color: label.textColor }}
            className="text-xs"
          >
            {label.name}
          </Badge>
        </button>
      ))}
    </div>
  );
}
