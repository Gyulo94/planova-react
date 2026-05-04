import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import z from "zod/v3";
import { Project } from "../../type";
import { ProjectFormSchema } from "../../schema";
import ProjectForm from "../../components/project-form";
import { useFindProjectById, useUpdateProject } from "../../query";

interface EditSectionProps {
  projectId?: string;
}

export default function EditSection({ projectId }: EditSectionProps) {
  const [isDisabled, setIsDisabled] = useState(false);
  const { data, isLoading } = useFindProjectById(projectId);
  const { mutate: updateProject } = useUpdateProject(projectId);
  const project: Project = data as Project;

  const defaultValues = {
    name: project?.name,
    image: project?.image || "",
  };

  function onSubmit(values: z.infer<typeof ProjectFormSchema>) {
    setIsDisabled(true);
    updateProject(values, {
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
          <CardTitle className="text-lg">프로젝트 수정</CardTitle>
          <CardDescription>프로젝트 정보를 수정합니다.</CardDescription>
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
        <CardTitle className="text-lg">프로젝트 수정</CardTitle>
        <CardDescription>프로젝트 정보를 수정합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <ProjectForm
          id={projectId}
          isDisabled={isDisabled}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
