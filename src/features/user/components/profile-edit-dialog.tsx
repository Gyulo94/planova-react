import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useDeleteUser,
  useSession,
  useUpdateUser,
} from "@/features/user/query";
import { useEditUserProfileDialogStore } from "@/features/user/store";
import ProfileForm from "./profile-form";
import { useConfirm } from "@/hooks/use-confirm";
import z from "zod/v3";
import { UserProfileSchema } from "../schema";

export function EditUserProfileDialog() {
  const { data: session } = useSession();
  const { isOpen, onClose } = useEditUserProfileDialogStore();
  const { mutate: updateUser } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();
  const [ConfirmDialog, confirm] = useConfirm(
    "정말 탈퇴하시겠습니까?",
    "회원 탈퇴 시 모든 데이터가 복구 불가능하게 삭제됩니다. 그래도 진행하시겠습니까?",
  );

  const defaultValues = {
    name: session?.name || "",
    image: session?.image || "",
  };

  async function handleDelete() {
    const ok = await confirm();
    if (ok) {
      deleteUser(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  }

  function onSubmit(values: z.infer<typeof UserProfileSchema>) {
    updateUser(values, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  if (!session) return null;

  return (
    <>
      <ConfirmDialog />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              프로필 편집
            </DialogTitle>
            <DialogDescription>
              사용자 정보를 수정하거나 계정을 관리할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm
            onSubmit={onSubmit}
            onDelete={handleDelete}
            defaultValues={defaultValues}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
