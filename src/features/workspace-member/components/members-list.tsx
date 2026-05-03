import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSession } from "@/features/user/query";

import { useConfirm } from "@/hooks/use-confirm";
import { useFindWorkspaceMembers } from "../query";
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
import { useOpenWorkspaceInviteCodeDialogStore } from "../store";

interface MembersListProps {
  workspaceId?: string;
}

export default function MembersList({ workspaceId }: MembersListProps) {
  const { data: session } = useSession();
  const { data: workspaceMembers } = useFindWorkspaceMembers(workspaceId);
  const { onOpen } = useOpenWorkspaceInviteCodeDialogStore();

  const [ConfirmDialog, confirm] = useConfirm(
    "정말로 멤버를 추방하시겠습니까?",
    "추방된 멤버는 워크스페이스에 다시 접근할 수 없습니다.",
  );

  function handleInviteMember() {
    onOpen(workspaceId!);
  }

  return (
    <>
      <ConfirmDialog />
      <Card className="size-full border-none shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">워크스페이스 멤버</h2>
            {workspaceMembers?.find((m) => m.userId === session?.id)?.role !==
              "MEMBER" && (
              <Button onClick={handleInviteMember}>
                <PlusIcon />새 멤버 추가
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {workspaceMembers?.map((member, index) => (
            <Fragment key={member.id}>
              <div className="flex items-center gap-2">
                <CircleAvatar
                  url={member.user.image || DEFAULT_AVATAR}
                  name={member.user.name || "Unknown User"}
                  size="lg"
                  className="cursor-pointer"
                  onClick={() => {}}
                />
                <div className="flex flex-col">
                  <p className="text-sm font-medium">
                    {member.user.name || "Unknown User"}{" "}
                    {member.role === "OWNER" ? (
                      <Badge
                        variant={"default"}
                        className="py-0 px-1.5 ml-auto"
                      >
                        소유자
                      </Badge>
                    ) : null}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member.user.email || "Unknown Email"}
                  </p>
                </div>
                {session?.id !== member.userId && member.role !== "OWNER" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="ml-auto"
                        variant={"ghost"}
                        size={"icon"}
                      >
                        <MoreVerticalIcon className="size-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="end">
                      <DropdownMenuItem
                        className="font-medium"
                        onClick={() => {}}
                        disabled={false}
                      >
                        {member.role === "MEMBER"
                          ? "어드민으로 변경"
                          : "멤버로 변경"}
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="font-medium text-destructive"
                        onClick={() => {}}
                        disabled={false}
                      >
                        멤버 추방
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  session?.id === member.userId && (
                    <Badge className="ml-auto">나</Badge>
                  )
                )}
              </div>
              {index < workspaceMembers.length - 1 && (
                <Separator className="my-2.5" />
              )}
            </Fragment>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
