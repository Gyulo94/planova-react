import CircleAvatar from "@/components/ui/circle-avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DEFAULT_AVATAR } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";

export default function AssigneeFilterContent({
  members,
  selectedIds,
  onToggle,
}: {
  members: any[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <ScrollArea className="space-y-1 max-h-80">
      {members.map((member) => {
        const isChecked = selectedIds.includes(member.userId);
        return (
          <div
            key={member.id}
            onClick={() => onToggle(member.userId)}
            className={`cursor-pointer w-full flex items-center gap-2 p-2 rounded hover:bg-accent transition-colors ${
              isChecked ? "bg-accent" : ""
            }`}
          >
            <Checkbox
              checked={isChecked}
              onCheckedChange={() => onToggle(member.userId)}
              onClick={(e) => e.stopPropagation()}
            />
            <CircleAvatar
              name={member.user.name || "Unknown User"}
              url={member.user.image || DEFAULT_AVATAR}
              size="sm"
            />
            <span className="truncate text-sm">
              {member.user.name || "Unknown User"}
            </span>
          </div>
        );
      })}
    </ScrollArea>
  );
}
