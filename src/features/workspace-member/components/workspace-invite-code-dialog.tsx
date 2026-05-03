import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useOpenWorkspaceInviteCodeDialogStore } from "../store";
import { useFindWorkspaceById } from "@/features/workspace/query";
import { CLINENT_URL } from "@/lib/constants";

export default function WorkspaceInviteCodeDialog() {
  const { isOpen, onClose, workspaceId } =
    useOpenWorkspaceInviteCodeDialogStore();

  const { data: workspace } = useFindWorkspaceById(workspaceId);

  const inviteLink = `${CLINENT_URL}/workspaces/${workspace?.id}/join/${workspace?.inviteCode}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            워크스페이스 초대 코드
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            아래 초대 코드를 공유하여 다른 사용자를 워크스페이스에 초대할 수
            있습니다.
          </p>
          <div className="flex items-center gap-2">
            <Input
              value={inviteLink || "초대 코드 없음"}
              readOnly
              className="flex-1"
            />
            {workspace?.inviteCode && (
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(inviteLink);
                  toast.success("초대 코드가 클립보드에 복사되었습니다.");
                }}
              >
                복사
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
