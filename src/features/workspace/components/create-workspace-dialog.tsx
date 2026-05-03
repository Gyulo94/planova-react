import { useState } from "react";
import z from "zod/v3";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WorkspaceForm from "./workspace-form";
import { useOpenWorkspaceDialogStore } from "../store";
import { WorkspaceFormSchema } from "../schema";
import { useCreateWorkspace } from "../query";

export default function CreateWorkspaceDialog() {
  const { isOpen, onClose } = useOpenWorkspaceDialogStore();
  const [isDisabled, setIsDisabled] = useState(false);
  const { mutate: createWorkspace } = useCreateWorkspace();

  const defaultValues = {
    name: "",
    image: "",
  };

  function onSubmit(values: z.infer<typeof WorkspaceFormSchema>) {
    setIsDisabled(true);
    createWorkspace(values, {
      onSuccess: () => {
        setIsDisabled(false);
        onClose();
      },
      onError: () => {
        setIsDisabled(false);
      },
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            워크스페이스 생성
          </DialogTitle>
        </DialogHeader>
        <WorkspaceForm
          isDisabled={isDisabled}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
