import { ScrollArea } from "@/components/ui/scroll-area";
import { Priority } from "@/lib/type";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { TaskPriorityConfig } from "@/features/task/enum";
import { cn } from "@/lib/utils";

interface PriorityFilterContentProps {
  selected: string[];
  onToggle: (priority: Priority) => void;
}

export default function PriorityFilterContent({
  selected,
  onToggle,
}: PriorityFilterContentProps) {
  return (
    <ScrollArea className="space-y-1 max-h-80">
      {Object.values(Priority).map((priority) => {
        const isChecked = selected.includes(priority);
        const config = TaskPriorityConfig[priority as keyof typeof TaskPriorityConfig];
        
        return (
          <div
            key={priority}
            onClick={() => onToggle(priority as Priority)}
            className={`cursor-pointer w-full flex items-center gap-2 p-2 rounded hover:bg-accent transition-colors text-left ${
              isChecked ? "bg-accent" : ""
            }`}
          >
            <Checkbox 
              checked={isChecked} 
              onCheckedChange={() => onToggle(priority as Priority)} 
              onClick={(e) => e.stopPropagation()}
            />
            <Badge 
              variant="outline" 
              className={cn("font-medium", config.badgeClassName)}
            >
              {config.label}
            </Badge>
          </div>
        );
      })}
    </ScrollArea>
  );
}
