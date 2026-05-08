import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MilestoneForm from "./milestone-form";
import { useCreateMilestone } from "../query";
import { useState } from "react";
import z from "zod/v3";
import { MilestoneFormSchema } from "../schema";
import { useOpenMilestoneDialogStore } from "../store";

export default function CreateMilestoneDialog() {
  const { isOpen, onClose, workspaceId, projectId } =
    useOpenMilestoneDialogStore();
  const [isDisabled, setIsDisabled] = useState(false);

  const { mutate: createMilestone } = useCreateMilestone();

  const defaultValues = {
    title: "",
    description: "",
    dueDate: new Date(),
    workspaceId: workspaceId || "",
    projectId: projectId || "",
    completed: false,
  };

  function onSubmit(values: z.infer<typeof MilestoneFormSchema>) {
    setIsDisabled(true);

    createMilestone(values, {
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
            새 마일스톤 생성
          </DialogTitle>
        </DialogHeader>
        <MilestoneForm
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          isDisabled={isDisabled}
        />
      </DialogContent>
    </Dialog>
  );
}
