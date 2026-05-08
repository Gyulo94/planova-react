import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSession } from "@/features/user/query";

import { useConfirm } from "@/hooks/use-confirm";
import { Fragment } from "react/jsx-runtime";
import CircleAvatar from "@/components/ui/circle-avatar";
import { DEFAULT_AVATAR } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon, PlusIcon } from "lucide-react";
import {
  useFindProjectMembers,
  useRemoveProjectMember,
  useUpdateProjectMember,
} from "../query";
import { useOpenInviteProjectMemberDialogStore } from "../store";

interface ProjectMembersListProps {
  projectId?: string;
}

export default function ProjectMembersList({
  projectId,
}: ProjectMembersListProps) {
  const { data: session } = useSession();
  const { data: projectMembers } = useFindProjectMembers(projectId);
  const { mutate: updateMember } = useUpdateProjectMember(projectId);
  const { mutate: removeMember } = useRemoveProjectMember(projectId);
  const { onOpen } = useOpenInviteProjectMemberDialogStore();

  const [ConfirmDialog, confirm] = useConfirm(
    "정말로 멤버를 추방하시겠습니까?",
    "추방된 멤버는 프로젝트에 다시 접근할 수 없습니다.",
  );

  function handleInviteMember() {
    onOpen(projectId);
  }

  function handleUpdateMember(userId: string): void {
    updateMember(userId);
  }

  async function handleRemoveMember(userId: string): Promise<void> {
    const ok = await confirm();
    if (ok) {
      removeMember(userId);
    }
  }

  return (
    <>
      <ConfirmDialog />
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-bold text-foreground">프로젝트 멤버</h2>
          {projectMembers?.find((m) => m.userId === session?.id)?.role !==
            "MEMBER" && (
            <Button onClick={handleInviteMember} className="rounded-xl gap-2">
              <PlusIcon className="size-4" />새 멤버 초대
            </Button>
          )}
        </div>

        <Separator className="opacity-50" />

        <div className="p-6 space-y-4">
          {projectMembers?.map((member, index) => (
            <Fragment key={member.id}>
              <div className="flex items-center gap-4 group transition-all">
                <CircleAvatar
                  url={member.user.image || DEFAULT_AVATAR}
                  name={member.user.name || "Unknown User"}
                  size="lg"
                  className="size-11 border-2 border-background shadow-sm"
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground truncate">
                      {member.user.name || "Unknown User"}
                    </p>
                    <div className="flex gap-1">
                      {member.role === "OWNER" && (
                        <Badge variant="default" className="text-[10px] py-0 px-2 bg-primary/10 text-primary border-none font-bold">
                          소유자
                        </Badge>
                      )}
                      {member.role === "ADMIN" && (
                        <Badge variant="secondary" className="text-[10px] py-0 px-2 font-bold">
                          관리자
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {member.user.email || "Unknown Email"}
                  </p>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  {session?.id === member.userId && (
                    <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">나</Badge>
                  )}
                  
                  {session?.id !== member.userId && member.role !== "OWNER" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVerticalIcon className="size-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="bottom" align="end" className="rounded-xl">
                        <DropdownMenuItem
                          className="font-medium cursor-pointer"
                          onClick={() => handleUpdateMember(member.userId)}
                        >
                          {member.role === "MEMBER"
                            ? "관리자로 지정"
                            : "멤버로 변경"}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="font-medium text-destructive cursor-pointer"
                          onClick={() => handleRemoveMember(member.userId)}
                        >
                          멤버 추방
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
              {index < projectMembers.length - 1 && (
                <Separator className="opacity-30" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
