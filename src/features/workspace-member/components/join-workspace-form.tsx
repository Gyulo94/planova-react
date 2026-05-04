import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useFindWorkspaceById } from "@/features/workspace/query";
import { useNavigate } from "react-router-dom";

import { toast } from "sonner";
import { useJoinWorkspace } from "../query";

interface JoinWorkspaceFormProps {
  workspaceId?: string;
  inviteCode?: string;
}

export default function JoinWorkspaceForm({
  workspaceId,
  inviteCode,
}: JoinWorkspaceFormProps) {
  const { data: workspace } = useFindWorkspaceById(workspaceId);
  const { mutate: joinWorkspace } = useJoinWorkspace(workspaceId);
  const navigate = useNavigate();

  function handleJoinWorkspace(inviteCode: string) {
    if (!inviteCode || workspace?.inviteCode !== inviteCode) {
      toast.error("유효하지 않은 초대 코드입니다.");
      navigate("/");
      return;
    } else {
      joinWorkspace(inviteCode);
    }
  }
  return (
    <Card className="size-full max-w-lg border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          워크스페이스 참가
        </CardTitle>
      </CardHeader>
      <div className="border relative size-32 mx-auto rounded-lg overflow-hidden bg-neutral-100">
        <img
          src={workspace?.image}
          className="object-center object-cover"
          alt={workspace?.name}
        />
      </div>
      <p className="text-sm text-center px-4 text-muted-foreground">
        <strong>{workspace?.name}</strong> 워크스페이스에 초대되었습니다. <br />
        아래 참가 버튼을 통해 참가할 수 있습니다.
      </p>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col  items-center">
          <Button
            className="w-full"
            size={"md"}
            type="button"
            onClick={() => handleJoinWorkspace(inviteCode || "")}
          >
            참가
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
