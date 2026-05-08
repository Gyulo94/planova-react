import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SquareAvatar from "@/components/ui/square-avatar";
import { useFindWorkspaces } from "@/features/workspace/query";
import { useOpenWorkspaceDialogStore } from "@/features/workspace/store";
import { RiAddFill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";

export default function WorkspaceSwitcher() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { onOpen } = useOpenWorkspaceDialogStore();
  const { data } = useFindWorkspaces();
  const workspaces = data || [];

  function onSelect(workspaceId: string) {
    navigate(`/workspaces/${workspaceId}`);
  }

  return (
    <div className="flex flex-col gap-y-2 px-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">워크스페이스</p>
        <div
          className="size-5 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:opacity-75 transition"
          onClick={onOpen}
        >
          <RiAddFill className="size-4 text-white" />
        </div>
      </div>
      <Select onValueChange={onSelect} value={workspaceId ?? ""}>
        <SelectTrigger
          className="w-full bg-accent font-medium py-6 px-2 h-14"
          suppressHydrationWarning
        >
          <SelectValue placeholder="워크스페이스 선택" className="truncate" />
        </SelectTrigger>
        <SelectContent
          position="popper"
          side="bottom"
          className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)]"
        >
          {workspaces.map((workspace) => (
            <SelectItem
              key={workspace.id}
              value={workspace.id}
              className="px-2"
            >
              <div className="flex justify-start items-center gap-2 font-medium w-full min-w-0">
                <SquareAvatar
                  name={workspace.name}
                  url={workspace.image}
                  className="shrink-0"
                />
                <span className="truncate text-sm">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
