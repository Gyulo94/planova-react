import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EpicForm from "./epic-form";
import { useFindEpic, useUpdateEpic } from "../query";
import { useState } from "react";
import z from "zod/v3";
import { EpicFormSchema } from "../schema";
import { useEditEpicDialogStore } from "../store";
import Loader from "@/components/ui/loader";

export default function EditEpicDialog() {
  const { isOpen, onClose, id } = useEditEpicDialogStore();
  const [isDisabled, setIsDisabled] = useState(false);

  const { mutate: updateEpic } = useUpdateEpic(id);
  const { data: epic, isLoading } = useFindEpic(id);

  if (isLoading) {
    return <Loader />;
  }

  const defaultValues: z.infer<typeof EpicFormSchema> = {
    title: epic?.title ?? "",
    description: epic?.description ?? "",
    startDate: new Date(epic?.startDate || Date.now()),
    dueDate: new Date(epic?.dueDate || Date.now()),
    workspaceId: epic?.workspaceId ?? "",
    projectId: epic?.projectId ?? "",
    milestoneId: epic?.milestoneId ?? "none",
  };

  function onSubmit(values: z.infer<typeof EpicFormSchema>) {
    setIsDisabled(true);

    updateEpic(values, {
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
          <DialogTitle className="text-xl font-bold">에픽 수정</DialogTitle>
        </DialogHeader>
        <EpicForm
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          isDisabled={isDisabled}
          id={id}
          projectId={epic?.projectId}
        />
      </DialogContent>
    </Dialog>
  );
}
