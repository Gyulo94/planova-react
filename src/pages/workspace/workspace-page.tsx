import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WorkspaceForm from "@/features/workspace/components/workspace-form";
import {
  useCreateWorkspace,
  useFindWorkspaces,
} from "@/features/workspace/query";
import { WorkspaceFormSchema } from "@/features/workspace/schema";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import z from "zod/v3";

export default function WorkspacePage() {
  const [isDisabled, setIsDisabled] = useState(false);
  const { mutate: createWorkspace } = useCreateWorkspace();
  const { data: workspaces } = useFindWorkspaces();

  const navigate = useNavigate();

  const defaultValues = {
    name: "",
    image: "",
  };

  useEffect(() => {
    if (workspaces && workspaces.length > 0) {
      navigate(`/workspaces/${workspaces[0].id}`);
    } else {
      navigate("/workspaces/new");
    }
  }, [workspaces, navigate]);

  function onSubmit(values: z.infer<typeof WorkspaceFormSchema>) {
    console.log(values);

    setIsDisabled(true);
    createWorkspace(values, {
      onSuccess: (data) => {
        setIsDisabled(false);
        navigate(`/workspaces/${data.body.id}`);
      },
      onError: () => {
        setIsDisabled(false);
      },
    });
  }

  return (
    <>
      <div className="bg-background absolute left-0 top-0 min-h-screen w-full z-50" />
      <Dialog open={true}>
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
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
