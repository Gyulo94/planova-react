import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOpenInviteProjectMemberDialogStore } from "@/features/project-member/store";
import {
  useFindAvailableWorkspaceMembers,
  useInviteProjectMember,
} from "../query";
import { WorkspaceMember } from "@/features/workspace-member/type";
import { DEFAULT_AVATAR } from "@/lib/constants";
import CircleAvatar from "@/components/ui/circle-avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function InviteProjectMemberDialog() {
  const { isOpen, onClose, projectId } =
    useOpenInviteProjectMemberDialogStore();
  const { data: availableMembers, isLoading } =
    useFindAvailableWorkspaceMembers(projectId);
  const { mutate: inviteMembers, isPending } =
    useInviteProjectMember(projectId);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  function handleCheckedChange(userId: string, checked: boolean) {
    setSelectedUserIds((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId),
    );
  }

  function handleInvite() {
    if (selectedUserIds.length === 0) return;
    inviteMembers(selectedUserIds, {
      onSuccess: () => {
        setSelectedUserIds([]);
        onClose();
      },
    });
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setSelectedUserIds([]);
      onClose();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            프로젝트 멤버 초대
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[360px] pr-1">
          {isLoading ? (
            <p className="text-sm text-neutral-500 py-4 text-center">
              불러오는 중...
            </p>
          ) : availableMembers && availableMembers.length > 0 ? (
            <div className="flex flex-col gap-1">
              {availableMembers.map((member: WorkspaceMember) => {
                const isChecked = selectedUserIds.includes(member.userId);
                return (
                  <label
                    key={member.id}
                    htmlFor={`member-${member.userId}`}
                    className="flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer hover:bg-accent transition-colors"
                  >
                    <Checkbox
                      id={`member-${member.userId}`}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleCheckedChange(member.userId, !!checked)
                      }
                    />
                    <CircleAvatar
                      url={member.user?.image || DEFAULT_AVATAR}
                      name={member.user?.name || "Unknown User"}
                      size="sm"
                      isTooltipEnabled={false}
                    />
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-medium">
                        {member.user?.name || "Unknown User"}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {member.user?.email}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-neutral-500 py-4 text-center">
              초대할 수 있는 멤버가 없습니다.
            </p>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            취소
          </Button>
          <Button
            onClick={handleInvite}
            disabled={selectedUserIds.length === 0 || isPending}
          >
            {isPending ? "초대 중..." : `초대 (${selectedUserIds.length}명)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
