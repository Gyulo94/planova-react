import { useFindWorkspaceMembers } from "@/features/workspace-member/query";
import { Role } from "@/features/workspace-member/type";
import { useSession } from "@/features/user/query";
import { NotFoundPage } from "@/pages";
import { Outlet, useParams } from "react-router-dom";

export default function WorkspaceOwnerRoute() {
  const { workspaceId } = useParams();
  const { data: session, isLoading: isSessionLoading } = useSession();
  const {
    data: workspaceMembers,
    isLoading,
    isError,
  } = useFindWorkspaceMembers(workspaceId);

  if (!workspaceId) {
    return <NotFoundPage />;
  }

  if (isSessionLoading || isLoading) {
    return null;
  }

  if (isError || !session || !workspaceMembers) {
    return <NotFoundPage />;
  }

  const myMember = workspaceMembers.find(
    (member) => member.userId === session.id,
  );
  if (!myMember || myMember.role !== Role.OWNER) {
    return <NotFoundPage />;
  }

  return <Outlet />;
}
