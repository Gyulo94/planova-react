import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOpenWorkspaceDialogStore } from "@/features/workspace/store";
import { RiAddCircleFill } from "react-icons/ri";
import { useParams } from "react-router-dom";

export default function ProjectSwitcher() {
  const { projectId } = useParams();
  const { onOpen } = useOpenWorkspaceDialogStore();
  // const { projectId } = useParameters();
  // const { data } = useFindWorkspace();
  // const router = useRouter();
  // const projects: Project[] = data || [];

  function onSelect(projectId: string) {
    // router.push(`/projects/${projectId}`);
  }

  return (
    <div className="flex flex-col gap-y-2 px-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-500">프로젝트</p>
        <RiAddCircleFill
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
          onClick={onOpen}
        />
      </div>
      <Select onValueChange={onSelect} value={projectId ?? ""}>
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
        ></SelectContent>
      </Select>
    </div>
  );
}
