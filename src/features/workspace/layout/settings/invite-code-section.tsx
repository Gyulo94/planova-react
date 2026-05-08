import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useConfirm } from "@/hooks/use-confirm";
import { CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useFindWorkspaceById, useResetInviteCode } from "../../query";

interface Props {
  workspaceId?: string;
}

export default function InviteCodeSection({ workspaceId }: Props) {
  const { data: workspace } = useFindWorkspaceById(workspaceId);
  const [ConfirmDialog, confirm] = useConfirm(
    "정말로 초대 코드를 재발급하시겠습니까?",
    "기존 초대 코드는 더 이상 유효하지 않게 됩니다.",
  );
  const { mutate: resetInviteCode } = useResetInviteCode();
  const [isDisabled, setIsDisabled] = useState(false);

  const [fullInviteLink, setFullInviteLink] = useState("");

  useEffect(() => {
    if (workspace?.inviteCode) {
      setFullInviteLink(
        `${window.location.origin}/workspaces/${workspaceId}/join/${workspace.inviteCode}`,
      );
    }
  }, [workspaceId, workspace?.inviteCode]);

  function handleCopyInviteLink() {
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => toast.success("초대 링크가 복사되었습니다."));
  }

  async function handleResetInviteCode(workspaceId?: string) {
    const ok = await confirm();
    if (ok) {
      setIsDisabled(true);
      resetInviteCode(workspaceId, {
        onSuccess: () => {
          setIsDisabled(false);
        },
        onError: () => {
          setIsDisabled(false);
        },
      });
    }
  }

  return (
    <>
      <ConfirmDialog />
      <Card className="p-7 rounded-2xl bg-card shadow-xl shadow-foreground/5 border border-border/50 overflow-hidden">
        <div className="flex flex-col">
          <CardTitle className="text-lg">멤버 초대</CardTitle>
          <p className="text-sm text-muted-foreground">
            초대 코드를 통해 새로운 멤버를 워크스페이스에 초대할 수 있습니다.
          </p>
          <div className="mt-4">
            <div className="flex items-center gap-x-2">
              <Input disabled value={fullInviteLink} className="h-12" />
              <Button
                onClick={handleCopyInviteLink}
                variant={"secondary"}
                size={"sm"}
                className="size-12"
              >
                <CopyIcon />
              </Button>
            </div>
          </div>
          <Separator className="my-7" />
          <Button
            variant="primary"
            size={"sm"}
            className="mt-6 w-fit ml-auto"
            disabled={isDisabled}
            type="button"
            onClick={() => handleResetInviteCode(workspaceId)}
          >
            초대코드 재발급
          </Button>
        </div>
      </Card>
    </>
  );
}
