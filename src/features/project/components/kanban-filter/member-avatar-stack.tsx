import CircleAvatar from "@/components/ui/circle-avatar";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProjectMember } from "@/features/project-member/type";
import { DEFAULT_AVATAR } from "@/lib/constants";

export default function MemberAvatarStack({
  members,
  visibleCount = 6,
}: {
  members: ProjectMember[];
  visibleCount?: number;
}) {
  const visible = members.slice(0, visibleCount);
  const hidden = members.slice(visibleCount);
  const remaining = hidden.length;

  return (
    <div className="flex items-center -space-x-3">
      {visible.map((member, idx) => (
        <div
          key={member.id}
          className={
            idx === visible.length - 1 ? "relative hover:z-30" : undefined
          }
        >
          <CircleAvatar
            name={member.user.name || "Unknown User"}
            url={member.user.image || DEFAULT_AVATAR}
            isTooltipEnabled
          />
        </div>
      ))}

      {remaining > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="cursor-pointer relative z-20 flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-semibold text-primary-foreground hover:brightness-95"
              aria-label={`숨겨진 멤버 ${remaining}명 보기`}
            >
              +{remaining}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start" side="bottom">
            <PopoverHeader className="mb-2">
              <PopoverTitle className="text-sm">숨겨진 참여자</PopoverTitle>
            </PopoverHeader>
            <div className="space-y-2 max-h-80 overflow-auto">
              {hidden.map((member) => (
                <div key={member.id} className="flex items-center gap-2">
                  <CircleAvatar
                    name={member.user.name || "Unknown User"}
                    url={member.user.image || DEFAULT_AVATAR}
                    size="sm"
                  />
                  <span className="truncate text-sm">{member.user.name}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
