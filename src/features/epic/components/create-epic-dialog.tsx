import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOpenEpicDialogStore } from "../store";
import EpicForm from "./epic-form";
import { useCreateEpic } from "../query";
import { useState } from "react";
import z from "zod/v3";
import { EpicFormSchema } from "../schema";

export default function CreateEpicDialog() {
  const { isOpen, onClose, workspaceId, projectId } = useOpenEpicDialogStore();
  const [isDisabled, setIsDisabled] = useState(false);

  const { mutate: createEpic } = useCreateEpic();

  const defaultValues = {
    title: "",
    description: "",
    startDate: new Date(),
    dueDate: new Date(),
    workspaceId: workspaceId ?? "",
    projectId: projectId ?? "",
  };

  function onSubmit(values: z.infer<typeof EpicFormSchema>) {
    setIsDisabled(true);

    createEpic(values, {
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
          <DialogTitle className="text-xl font-bold">새 에픽 생성</DialogTitle>
        </DialogHeader>
        <EpicForm
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          isDisabled={isDisabled}
        />
      </DialogContent>
    </Dialog>
  );
}
