import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../../query";

interface DeleteSectionProps {
  workspaceId?: string;
}

export default function DeleteSection({ workspaceId }: DeleteSectionProps) {
  const { mutate: deleteWorkspace, isPending } = useDeleteWorkspace();
  const [ConfirmDialog, confirm] = useConfirm(
    "정말로 워크스페이스를 삭제하시겠습니까?",
    "삭제된 워크스페이스 데이터는 복구할 수 없습니다.",
  );

  async function handleDelete() {
    const ok = await confirm();
    if (ok) {
      deleteWorkspace(workspaceId);
    }
  }
  return (
    <>
      <ConfirmDialog />
      <Card className="p-7 border-none shadow-none">
        <div className="flex flex-col">
          <CardTitle className="text-lg">워크스페이스 삭제</CardTitle>
          <p className="text-sm text-muted-foreground">
            워크스페이스를 삭제하면 해당 워크스페이스의 모든 데이터가 영구적으로
            삭제됩니다. 이 작업은 되돌릴 수 없습니다.
          </p>
          <Separator className="my-7" />
          <Button
            variant="destructive"
            size={"sm"}
            className="mt-6 w-fit ml-auto"
            disabled={isPending}
            type="button"
            onClick={handleDelete}
          >
            워크스페이스 삭제
          </Button>
        </div>
      </Card>
    </>
  );
}
