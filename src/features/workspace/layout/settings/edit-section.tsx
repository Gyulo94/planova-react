import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WorkspaceForm from "../../components/workspace-form";
import { useFindWorkspaceById, useUpdateWorkspace } from "../../query";
import { Workspace } from "../../type";
import { useState } from "react";
import z from "zod/v3";
import { WorkspaceFormSchema } from "../../schema";

interface EditSectionProps {
  workspaceId?: string;
}

export default function EditSection({ workspaceId }: EditSectionProps) {
  const [isDisabled, setIsDisabled] = useState(false);
  const { data, isLoading } = useFindWorkspaceById(workspaceId);
  const { mutate: updateWorkspace } = useUpdateWorkspace(workspaceId);
  const workspace: Workspace = data as Workspace;

  const defaultValues = {
    name: workspace?.name,
    image: workspace?.image || "",
  };

  function onSubmit(values: z.infer<typeof WorkspaceFormSchema>) {
    setIsDisabled(true);
    updateWorkspace(values, {
      onSuccess: () => {
        setIsDisabled(false);
      },
      onError: () => {
        setIsDisabled(false);
      },
    });
  }

  if (isLoading) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">워크스페이스 수정</CardTitle>
          <CardDescription>워크스페이스 정보를 수정합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div>{null}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">워크스페이스 수정</CardTitle>
        <CardDescription>워크스페이스 정보를 수정합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <WorkspaceForm
          id={workspaceId}
          isDisabled={isDisabled}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
