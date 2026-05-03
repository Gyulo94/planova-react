import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SquareAvatar from "@/components/ui/square-avatar";
import { useSelectedProject } from "@/features/project/hook";
import { useFindProjects } from "@/features/project/query";
import { useOpenProjectDialogStore } from "@/features/project/store";
import { RiAddCircleFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export default function ProjectSwitcher() {
  const { workspaceId, selectedProjectId } = useSelectedProject();
  const { onOpen } = useOpenProjectDialogStore();
  const { data: projects } = useFindProjects(workspaceId);
  const navigate = useNavigate();

  function onSelect(projectId: string) {
    if (!workspaceId) return;
    navigate(`/workspaces/${workspaceId}/projects/${projectId}`);
  }

  return (
    <div className="flex flex-col gap-y-2 px-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-500">프로젝트</p>
        <RiAddCircleFill
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
          onClick={() => onOpen(workspaceId)}
        />
      </div>
      <Select onValueChange={onSelect} value={selectedProjectId}>
        <SelectTrigger
          className="w-full bg-accent font-medium py-6 px-2 h-14"
          suppressHydrationWarning
        >
          <SelectValue placeholder="프로젝트 선택" className="truncate" />
        </SelectTrigger>
        <SelectContent
          position="popper"
          side="bottom"
          className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)]"
        >
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <SelectItem key={project.id} value={project.id} className="px-2">
                <div className="flex justify-start items-center gap-2 font-medium w-full min-w-0">
                  <SquareAvatar
                    name={project.name}
                    url={project.image}
                    className="shrink-0"
                  />
                  <span className="truncate text-sm">{project.name}</span>
                </div>
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled className="px-2">
              <div className="flex justify-start items-center gap-2 font-medium w-full min-w-0">
                <span className="truncate text-sm">프로젝트가 없습니다.</span>
              </div>
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
