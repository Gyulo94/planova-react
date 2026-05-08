import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";

import WorkspaceSwitcher from "./workspace-switcher";
import ProjectSwitcher from "./project-switcher";
import ProjectNavigation from "./project-navigation";
import WorkspaceNavigation from "./workspace-navigation";
import { LOGO, LOGO_NAME } from "@/lib/constants";
import { Link } from "react-router-dom";

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center">
          <img
            src={LOGO}
            alt={LOGO}
            className="size-8 object-cover object-center"
          />
          <SidebarGroupLabel>
            <img
              src={LOGO_NAME}
              alt={LOGO_NAME}
              className="h-7 object-contain"
            />
          </SidebarGroupLabel>
        </Link>
      </SidebarHeader>
      <Separator className="mb-4" />
      <SidebarContent>
        <WorkspaceSwitcher />
        <WorkspaceNavigation />
        <Separator className="my-4" />
        <ProjectSwitcher />
        <ProjectNavigation />
      </SidebarContent>
    </Sidebar>
  );
}
