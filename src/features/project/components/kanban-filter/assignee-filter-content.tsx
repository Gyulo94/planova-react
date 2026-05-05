import CircleAvatar from "@/components/ui/circle-avatar";
import { DEFAULT_AVATAR } from "@/lib/constants";

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
    <div className="space-y-1 max-h-80 overflow-auto">
      {members.map((member) => (
        <button
          key={member.id}
          onClick={() => onToggle(member.userId)}
          className={`w-full flex items-center gap-2 p-2 rounded hover:bg-accent transition-colors ${
            selectedIds.includes(member.userId) ? "bg-accent" : ""
          }`}
        >
          <CircleAvatar
            name={member.user.name || "Unknown User"}
            url={member.user.image || DEFAULT_AVATAR}
            size="sm"
          />
          <span className="truncate text-sm">
            {member.user.name || "Unknown User"}
          </span>
        </button>
      ))}
    </div>
  );
}
