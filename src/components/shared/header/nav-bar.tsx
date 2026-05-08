import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { UserMenu } from "./user-menu";
import { Separator } from "@/components/ui/separator";
import { useLayoutStore } from "@/features/layout/store/use-layout-store";
import { useParams } from "react-router-dom";
import { useFindWorkspaceById } from "@/features/workspace/query";
import { useFindProjectById } from "@/features/project/query";

export default function NavBar() {
  const { title } = useLayoutStore();
  const { workspaceId, projectId } = useParams();
  const { data: workspace } = useFindWorkspaceById(workspaceId);
  const { data: project } = useFindProjectById(projectId);

  return (
    <header className="sticky top-0 z-40 w-full bg-sidebar backdrop-blur-xl transition-all duration-300 border-b">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <SidebarTrigger className="md:hidden" />
        <div className="hidden md:flex items-center gap-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4 mx-2 opacity-50" />
        </div>

        <div className="flex-1 flex items-center gap-2 overflow-hidden">
          <span className="text-sm font-bold text-muted-foreground/60 tracking-wider hidden sm:inline-block shrink-0">
            {workspace?.name || "Workspace"}
          </span>
          {project && (
            <>
              <span className="text-muted-foreground/40 hidden sm:inline-block">
                /
              </span>
              <span className="text-sm font-bold text-muted-foreground/60 tracking-wider hidden sm:inline-block shrink-0">
                {project.name}
              </span>
            </>
          )}
          {title && (
            <>
              <span className="text-muted-foreground/40 hidden sm:inline-block">
                /
              </span>
              <h1 className="text-sm font-bold text-foreground truncate animate-in fade-in slide-in-from-left-2 duration-300">
                {title}
              </h1>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
