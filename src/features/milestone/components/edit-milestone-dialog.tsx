import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEditMilestoneDialogStore } from "../store";
import MilestoneForm from "./milestone-form";
import { useFindMilestone, useUpdateMilestone } from "../query";
import { useState } from "react";
import z from "zod/v3";
import { MilestoneFormSchema } from "../schema";
import Loader from "@/components/ui/loader";

export default function EditMilestoneDialog() {
  const { isOpen, onClose, id } = useEditMilestoneDialogStore();
  const { data: milestone, isLoading } = useFindMilestone(id);
  const [isDisabled, setIsDisabled] = useState(false);

  const { mutate: updateMilestone } = useUpdateMilestone(id);

  const defaultValues: z.infer<typeof MilestoneFormSchema> = {
    title: milestone?.title ?? "",
    description: milestone?.description ?? "",
    dueDate: new Date(milestone?.dueDate ?? ""),
    workspaceId: milestone?.workspaceId ?? "",
    projectId: milestone?.projectId ?? "",
    completed: milestone?.completed ?? false,
  };

  if (isLoading) {
    return <Loader />;
  }

  function onSubmit(values: z.infer<typeof MilestoneFormSchema>) {
    setIsDisabled(true);

    updateMilestone(values, {
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
          <DialogTitle className="text-xl font-bold">마일스톤 수정</DialogTitle>
        </DialogHeader>
        <MilestoneForm
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          isDisabled={isDisabled}
          id={id}
        />
      </DialogContent>
    </Dialog>
  );
}
