import { useFindTask, useUpdateTask } from "../query";
import { useEditTaskDialogStore } from "../store";
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
import Loader from "@/components/ui/loader";

export default function EditTaskDialog() {
  const { isOpen, onClose, id, workspaceId, projectId, initialStatus } =
    useEditTaskDialogStore();
  const [isDisabled, setIsDisabled] = useState(false);
  const { mutate: updateTask } = useUpdateTask(id);
  const { data: task, isLoading } = useFindTask(id);

  if (isLoading) {
    return <Loader />;
  }

  if (!task) return null;

  const defaultValues = {
    title: task.title ?? "",
    labelId: task.labelId ?? undefined,
    labelName: task.label?.name ?? undefined,
    status: (task.status ?? initialStatus) as z.infer<typeof StatusTypes>,
    priority: (task.priority ?? "MEDIUM") as z.infer<typeof PriorityTypes>,
    startDate: task.startDate ? new Date(task.startDate) : undefined,
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    assigneeId: task.assigneeId ?? "",
    projectId: task.projectId ?? "",
    epicId: task.epicId ?? undefined,
  };

  function onSubmit(values: z.infer<typeof TaskFormSchema>) {
    setIsDisabled(true);
    updateTask(values, {
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
          <DialogTitle className="text-xl font-bold">작업 수정</DialogTitle>
        </DialogHeader>
        <TaskForm
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          isDisabled={isDisabled}
          id={id}
          workspaceId={workspaceId}
          projectId={projectId}
        />
      </DialogContent>
    </Dialog>
  );
}
