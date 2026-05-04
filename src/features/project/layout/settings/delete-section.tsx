import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteProject } from "../../query";

interface DeleteSectionProps {
  projectId?: string;
}

export default function DeleteSection({ projectId }: DeleteSectionProps) {
  const { mutate: deleteProject, isPending } = useDeleteProject();
  const [ConfirmDialog, confirm] = useConfirm(
    "정말로 프로젝트를 삭제하시겠습니까?",
    "삭제된 프로젝트 데이터는 복구할 수 없습니다.",
  );

  async function handleDelete() {
    const ok = await confirm();
    if (ok) {
      deleteProject(projectId);
    }
  }
  return (
    <>
      <ConfirmDialog />
      <Card className="p-7 border-none shadow-none">
        <div className="flex flex-col">
          <CardTitle className="text-lg">프로젝트 삭제</CardTitle>
          <p className="text-sm text-muted-foreground">
            프로젝트를 삭제하면 해당 프로젝트의 모든 데이터가 영구적으로
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
            프로젝트 삭제
          </Button>
        </div>
      </Card>
    </>
  );
}
