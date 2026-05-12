import { useCreateTask } from "../query";
import { useOpenTaskDialogStore } from "../store";
import { PriorityTypes, StatusTypes, TaskFormSchema } from "../schema";
import { useState } from "react";
import z from "zod/v3";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import TaskForm from "./task-form";
import { useSession } from "@/features/user/query";

export default function CreateTaskDialog() {
  const { isOpen, onClose, workspaceId, projectId, initialStatus } =
    useOpenTaskDialogStore();
  const { data: session } = useSession();
  const [isDisabled, setIsDisabled] = useState(false);
  const { mutate: createTask } = useCreateTask();

  const defaultValues = {
    title: "",
    labelId: "",
    labelName: "",
    status: (initialStatus ?? "TODO") as z.infer<typeof StatusTypes>,
    priority: "MEDIUM" as z.infer<typeof PriorityTypes>,
    startDate: new Date(),
    dueDate: new Date(),
    assigneeId: session?.id ?? "",
    projectId: projectId ?? "",
    epicId: "none",
  };

  function onSubmit(values: z.infer<typeof TaskFormSchema>) {
    setIsDisabled(true);
    createTask(values, {
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
          <DialogTitle className="text-xl font-bold">새 작업 생성</DialogTitle>
        </DialogHeader>
        <TaskForm
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          isDisabled={isDisabled}
          workspaceId={workspaceId}
          projectId={projectId}
        />
      </DialogContent>
    </Dialog>
  );
}
