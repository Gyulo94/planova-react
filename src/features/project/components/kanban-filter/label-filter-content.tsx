import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/features/label/type";
import { Checkbox } from "@/components/ui/checkbox";

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
    <ScrollArea className="space-y-1 max-h-80">
      {labels.map((label) => {
        const isChecked = selectedIds.includes(label.id);
        return (
          <div
            key={label.id}
            onClick={() => onToggle(label.id)}
            className={`cursor-pointer w-full flex items-center gap-2 p-2 rounded hover:bg-accent transition-colors ${
              isChecked ? "bg-accent" : ""
            }`}
          >
            <Checkbox
              checked={isChecked}
              onCheckedChange={() => onToggle(label.id)}
              onClick={(e) => e.stopPropagation()}
            />
            <Badge
              style={{ backgroundColor: label.bgColor, color: label.textColor }}
              className="text-xs"
            >
              {label.name}
            </Badge>
          </div>
        );
      })}
    </ScrollArea>
  );
}
