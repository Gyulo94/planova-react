import { Button } from "@/components/ui/button";
import CircleAvatar from "@/components/ui/circle-avatar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFindProjectMembers } from "@/features/project-member/query";
import { DEFAULT_AVATAR } from "@/lib/constants";
import { useParams } from "react-router-dom";

export default function KanbanFilter() {
  const { projectId } = useParams();
  const { data } = useFindProjectMembers(projectId);
  const projectMembers = data ?? [];

  const visibleMembers = projectMembers.slice(0, 6);
  const hiddenMembers = projectMembers.slice(6);
  const remainingMembersCount = Math.max(projectMembers.length - 6, 0);

  return (
    <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
      <div className="flex gap-2">
        <Input placeholder="검색" className="w-full max-w-xs" />
        <div className="flex items-center -space-x-3">
          {visibleMembers.map((member, index) => {
            const isLastVisibleMember = index === visibleMembers.length - 1;

            return (
              <div
                key={member.id}
                className={
                  isLastVisibleMember ? "relative hover:z-30" : undefined
                }
              >
                <CircleAvatar
                  name={member.user.name || "Unknown User"}
                  url={member.user.image || DEFAULT_AVATAR}
                  isTooltipEnabled={true}
                />
              </div>
            );
          })}
          {remainingMembersCount > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label={`숨겨진 멤버 ${remainingMembersCount}명 보기`}
                  className="cursor-pointer relative z-20 flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-semibold text-primary-foreground outline-none transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  +{remainingMembersCount}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="start" side="bottom">
                <PopoverHeader className="mb-2">
                  <PopoverTitle className="text-sm">숨겨진 참여자</PopoverTitle>
                </PopoverHeader>
                <div className="space-y-2">
                  {hiddenMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <CircleAvatar
                        name={member.user.name || "Unknown User"}
                        url={member.user.image || DEFAULT_AVATAR}
                        size="sm"
                        isTooltipEnabled={false}
                      />
                      <span className="truncate text-sm text-foreground">
                        {member.user.name || "Unknown User"}
                      </span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Select>
          <SelectTrigger className="w-full lg:w-auto">
            <SelectValue placeholder="담당자" />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom">
            <SelectItem value="assignee">담당자</SelectItem>
            <SelectItem value="priority">우선순위</SelectItem>
            <SelectItem value="dueDate">마감일</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full lg:w-auto">
            <SelectValue placeholder="우선순위" />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom">
            <SelectItem value="LOW">낮음</SelectItem>
            <SelectItem value="MEDIUM">보통</SelectItem>
            <SelectItem value="HIGH">높음</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full lg:w-auto">
            <SelectValue placeholder="라벨" />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom">
            <SelectItem value="LOW">낮음</SelectItem>
            <SelectItem value="MEDIUM">보통</SelectItem>
            <SelectItem value="HIGH">높음</SelectItem>
          </SelectContent>
        </Select>

      </div>
    </div>
  );
}
