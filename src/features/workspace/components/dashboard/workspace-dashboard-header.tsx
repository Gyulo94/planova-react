import SquareAvatar from "@/components/ui/square-avatar";
import { Workspace } from "../../type";

interface WorkspaceDashboardHeaderProps {
  workspace?: Workspace;
}

export default function WorkspaceDashboardHeader({
  workspace,
}: WorkspaceDashboardHeaderProps) {
  if (!workspace) return null;

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SquareAvatar
            name={workspace?.name}
            url={workspace?.image}
            className="size-12 rounded-xl shadow-lg"
          />
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-1"> {workspace?.name}</h1>
            <p className="text-muted-foreground">
              워크스페이스의 전반적인 현황과 최근 활동을 확인하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
